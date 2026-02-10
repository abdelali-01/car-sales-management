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
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { OrderStatus } from '../common/enums/order-status.enum';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('orders')
@UseGuards(SessionAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);
    return ApiResponseDto.success(order, 'Order created successfully');
  }

  @Get()
  async findAll(
    @Query()
    query: PaginationQueryDto & {
      status?: OrderStatus;
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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const order = await this.ordersService.update(id, updateOrderDto);
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
}
