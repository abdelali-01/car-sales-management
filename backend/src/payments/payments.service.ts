import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaymentMethod } from '../common/enums/payment-method.enum';
import { OrdersService } from '../orders/orders.service';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @Inject(forwardRef(() => OrdersService))
    private ordersService: OrdersService,
    private clientsService: ClientsService,
  ) { }

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    // Validate that the order exists
    const order = await this.ordersService.findOne(createPaymentDto.orderId);

    // Validate client if provided
    if (createPaymentDto.clientId) {
      await this.clientsService.findOne(createPaymentDto.clientId);
    } else if (order.clientId) {
      // Auto-populate clientId from order if not provided
      createPaymentDto.clientId = order.clientId;
    }

    const payment = this.paymentsRepository.create(createPaymentDto);
    return this.paymentsRepository.save(payment);
  }

  async findAll(
    query: PaginationQueryDto & {
      method?: PaymentMethod;
      orderId?: number;
      clientId?: number;
    },
  ): Promise<{ data: Payment[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, method, orderId, clientId } = query;

    const queryBuilder = this.paymentsRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.order', 'order')
      .leftJoinAndSelect('payment.client', 'client')
      .orderBy('payment.createdAt', 'DESC');


    if (method) {
      queryBuilder.andWhere('payment.method = :method', { method });
    }

    if (orderId) {
      queryBuilder.andWhere('payment.order_id = :orderId', { orderId });
    }

    if (clientId) {
      queryBuilder.andWhere('payment.client_id = :clientId', { clientId });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { id },
      relations: ['order', 'client'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment> {
    const payment = await this.findOne(id);


    Object.assign(payment, updatePaymentDto);
    return this.paymentsRepository.save(payment);
  }

  async remove(id: number): Promise<void> {
    const payment = await this.findOne(id);


    await this.paymentsRepository.remove(payment);
  }


  async getOrderPayments(orderId: number): Promise<Payment[]> {
    return this.paymentsRepository.find({
      where: { orderId },
      relations: ['client'],
      order: { createdAt: 'DESC' },
    });
  }

  async getClientPayments(clientId: number): Promise<Payment[]> {
    return this.paymentsRepository.find({
      where: { clientId },
      relations: ['order'],
      order: { createdAt: 'DESC' },
    });
  }
}
