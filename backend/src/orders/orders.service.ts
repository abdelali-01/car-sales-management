import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { OrderStatus } from '../common/enums/order-status.enum';
import { OfferStatus } from '../common/enums/offer-status.enum';
import { VisitorStatus } from '../common/enums/visitor-status.enum';
import { OffersService } from '../offers/offers.service';
import { VisitorsService } from '../visitors/visitors.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private offersService: OffersService,
    private visitorsService: VisitorsService,
  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Validate that the offer exists and is available
    const offer = await this.offersService.findOne(createOrderDto.offerId);

    if (offer.status === OfferStatus.SOLD) {
      throw new ConflictException('This offer has already been sold');
    }

    // If visitor is provided, validate it exists
    if (createOrderDto.visitorId) {
      await this.visitorsService.findOne(createOrderDto.visitorId);
    }

    // Create the order
    const order = this.ordersRepository.create(createOrderDto);
    const savedOrder = await this.ordersRepository.save(order);

    // Update offer status to RESERVED
    await this.offersService.update(offer.id, { status: OfferStatus.RESERVED });

    // If visitor is linked, update visitor status to INTERESTED
    if (createOrderDto.visitorId) {
      await this.visitorsService.updateStatus(
        createOrderDto.visitorId,
        VisitorStatus.INTERESTED,
      );
    }

    return this.findOne(savedOrder.id);
  }

  async findAll(
    query: PaginationQueryDto & {
      status?: OrderStatus;
    },
  ): Promise<{ data: Order[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, status } = query;

    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.offer', 'offer')
      .leftJoinAndSelect('order.visitor', 'visitor')
      .orderBy('order.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['offer', 'offer.images', 'visitor'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    // Block updates if order is completed or canceled
    if (
      order.status === OrderStatus.COMPLETED ||
      order.status === OrderStatus.CANCELED
    ) {
      throw new BadRequestException(`Cannot update a ${order.status} order`);
    }

    Object.assign(order, updateOrderDto);
    await this.ordersRepository.save(order);

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const order = await this.findOne(id);

    // Only allow deletion of CANCELED or PENDING orders
    if (
      order.status === OrderStatus.COMPLETED ||
      order.status === OrderStatus.CONFIRMED
    ) {
      throw new ConflictException(
        'Cannot delete a confirmed or completed order',
      );
    }

    // Reset offer status back to AVAILABLE if deleting
    await this.offersService.update(order.offerId, {
      status: OfferStatus.AVAILABLE,
    });

    // Reset visitor status if linked
    if (order.visitorId) {
      await this.visitorsService.updateStatus(
        order.visitorId,
        VisitorStatus.CONTACTED,
      );
    }

    await this.ordersRepository.remove(order);
  }

  async confirmOrder(id: number): Promise<Order> {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be confirmed');
    }

    order.status = OrderStatus.CONFIRMED;
    await this.ordersRepository.save(order);

    return this.findOne(id);
  }

  async completeOrder(id: number): Promise<Order> {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed orders can be completed');
    }

    order.status = OrderStatus.COMPLETED;
    await this.ordersRepository.save(order);

    // Update offer status to SOLD
    await this.offersService.update(order.offerId, {
      status: OfferStatus.SOLD,
    });

    // Update visitor status to CONVERTED if linked
    if (order.visitorId) {
      await this.visitorsService.updateStatus(
        order.visitorId,
        VisitorStatus.CONVERTED,
      );
    }

    return this.findOne(id);
  }

  async cancelOrder(id: number): Promise<Order> {
    const order = await this.findOne(id);

    if (order.status === OrderStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed order');
    }

    order.status = OrderStatus.CANCELED;
    await this.ordersRepository.save(order);

    // Reset offer status back to AVAILABLE
    await this.offersService.update(order.offerId, {
      status: OfferStatus.AVAILABLE,
    });

    // Update visitor status to LOST if linked
    if (order.visitorId) {
      await this.visitorsService.updateStatus(
        order.visitorId,
        VisitorStatus.LOST,
      );
    }

    return this.findOne(id);
  }
}
