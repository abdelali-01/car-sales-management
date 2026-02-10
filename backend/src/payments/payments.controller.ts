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
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaymentStatus } from '../common/enums/payment-status.enum';
import { PaymentMethod } from '../common/enums/payment-method.enum';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('payments')
@UseGuards(SessionAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    const payment = await this.paymentsService.create(createPaymentDto);
    return ApiResponseDto.success(payment, 'Payment created successfully');
  }

  @Get()
  async findAll(
    @Query()
    query: PaginationQueryDto & {
      status?: PaymentStatus;
      method?: PaymentMethod;
      orderId?: number;
      clientId?: number;
    },
  ) {
    const result = await this.paymentsService.findAll(query);
    return ApiResponseDto.success(result.data, undefined, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / result.limit),
    });
  }

  @Get('order/:orderId')
  async getOrderPayments(@Param('orderId', ParseIntPipe) orderId: number) {
    const payments = await this.paymentsService.getOrderPayments(orderId);
    return ApiResponseDto.success(payments);
  }

  @Get('client/:clientId')
  async getClientPayments(@Param('clientId', ParseIntPipe) clientId: number) {
    const payments = await this.paymentsService.getClientPayments(clientId);
    return ApiResponseDto.success(payments);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const payment = await this.paymentsService.findOne(id);
    return ApiResponseDto.success(payment);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ) {
    const payment = await this.paymentsService.update(id, updatePaymentDto);
    return ApiResponseDto.success(payment, 'Payment updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.paymentsService.remove(id);
    return ApiResponseDto.success(null, 'Payment deleted successfully');
  }

  @Post(':id/mark-paid')
  async markAsPaid(@Param('id', ParseIntPipe) id: number) {
    const payment = await this.paymentsService.markAsPaid(id);
    return ApiResponseDto.success(
      payment,
      'Payment marked as paid successfully',
    );
  }
}
