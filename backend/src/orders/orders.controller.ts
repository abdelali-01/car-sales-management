import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateOrderDocumentDto } from './dto/create-order-document.dto';

import { UpdateOrderDto } from './dto/update-order.dto';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { OrderStatus } from '../common/enums/order-status.enum';

import { ApiResponseDto } from '../common/dto/api-response.dto';
import { multerConfig } from '../common/config/upload.config';

const ordersMulterConfig = {
  ...multerConfig,
  storage: memoryStorage(),
};

const documentsMulterConfig = {
  storage: memoryStorage(),
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp|pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document)$/)) {
      return callback(new Error('Only image, PDF, and Word document files are allowed!'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
};

@Controller('orders')
@UseGuards(SessionAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @UseInterceptors(FileInterceptor('passportImage', ordersMulterConfig))
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const order = await this.ordersService.create(createOrderDto, file);
    return ApiResponseDto.success(order, 'Order created successfully');
  }


  @Get()
  async findAll(
    @Query()
    query: PaginationQueryDto & {
      status?: OrderStatus;
      clientId?: number;
    },
  ) {
    const result = await this.ordersService.findAll(query);
    return ApiResponseDto.success(result.data, undefined, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / result.limit),
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const order = await this.ordersService.findOne(id);
    return ApiResponseDto.success(order);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('passportImage', ordersMulterConfig))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const order = await this.ordersService.update(id, updateOrderDto, file);
    return ApiResponseDto.success(order, 'Order updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.ordersService.remove(id);
    return ApiResponseDto.success(null, 'Order deleted successfully');
  }

  @Post(':id/confirm')
  async confirmOrder(@Param('id', ParseIntPipe) id: number) {
    const order = await this.ordersService.confirmOrder(id);
    return ApiResponseDto.success(order, 'Order confirmed successfully');
  }

  @Post(':id/complete')
  async completeOrder(@Param('id', ParseIntPipe) id: number) {
    const order = await this.ordersService.completeOrder(id);
    return ApiResponseDto.success(order, 'Order completed successfully');
  }

  @Post(':id/cancel')
  async cancelOrder(@Param('id', ParseIntPipe) id: number) {
    const order = await this.ordersService.cancelOrder(id);
    return ApiResponseDto.success(order, 'Order canceled successfully');
  }

  @Post(':id/documents')
  @UseInterceptors(FileInterceptor('file', documentsMulterConfig))
  async uploadDocument(
    @Param('id', ParseIntPipe) id: number,
    @Body() createOrderDocumentDto: CreateOrderDocumentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const document = await this.ordersService.addDocument(
      id,
      createOrderDocumentDto,
      file,
    );
    return ApiResponseDto.success(document, 'Document uploaded successfully');
  }

  @Delete(':id/documents/:docId')
  async removeDocument(
    @Param('id', ParseIntPipe) id: number,
    @Param('docId', ParseIntPipe) docId: number,
  ) {
    await this.ordersService.removeDocument(docId);
    return ApiResponseDto.success(null, 'Document deleted successfully');
  }
}

