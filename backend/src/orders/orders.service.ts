import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Inject,
  forwardRef,
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
import { PaymentMethod } from '../common/enums/payment-method.enum';
import { OffersService } from '../offers/offers.service';

import { VisitorsService } from '../visitors/visitors.service';
import { ClientsService } from '../clients/clients.service';
import { PaymentsService } from '../payments/payments.service';
import { OrderDocument } from './entities/order-document.entity';
import { FileUploadService } from '../common/services/file-upload.service';
import { CreateOrderDocumentDto } from './dto/create-order-document.dto';


@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderDocument)
    private ordersDocumentRepository: Repository<OrderDocument>,
    private offersService: OffersService,
    private visitorsService: VisitorsService,
    private clientsService: ClientsService,
    @Inject(forwardRef(() => PaymentsService))
    private paymentsService: PaymentsService,
    private fileUploadService: FileUploadService,
  ) { }


  // Helper to convert visitor to client
  private async convertVisitorToClient(visitor: any, deposit: number, agreedPrice: number, orderId?: number) {
    // Calculate remaining balance
    const remainingBalance = agreedPrice - deposit;

    const newClient = await this.clientsService.create({
      name: visitor.name,
      phone: visitor.phone,
      email: visitor.email,
      totalSpent: agreedPrice, // Set total spent to agreed price
      remainingBalance: remainingBalance >= 0 ? remainingBalance : 0,
      address: '',
      notes: `Converted from visitor ID ${visitor.id}`,
    });

    await this.visitorsService.updateStatus(visitor.id, VisitorStatus.CONVERTED);

    // Create Payment for the deposit
    if (orderId && deposit > 0) {
      await this.paymentsService.create({
        orderId,
        clientId: newClient.id,
        amount: deposit,
        method: PaymentMethod.CASH, // Defaulting to CASH as per requirement implication or safe default
        notes: 'Deposit from visitor conversion',
      });
    }

    return newClient;
  }

  async create(
    createOrderDto: CreateOrderDto,
    passportFile?: Express.Multer.File,
  ): Promise<Order> {
    // Validate input: either offerId or orderedCar must be present, but not both (optional, or both is fine if logic permits, but usually one or other)
    if (!createOrderDto.offerId && !createOrderDto.orderedCar) {
      throw new BadRequestException('Either an offer or a custom car request must be provided');
    }

    let offer: any = null;
    if (createOrderDto.offerId) {
      offer = await this.offersService.findOne(createOrderDto.offerId);
      if (offer.status === OfferStatus.SOLD) {

        throw new ConflictException('This offer has already been sold');
      }
    }


    // If visitor is provided, validate it exists
    if (createOrderDto.visitorId) {
      await this.visitorsService.findOne(createOrderDto.visitorId);
    }

    // Handle passport image upload
    if (passportFile) {
      // Ensure directory exists
      this.fileUploadService.ensureUploadDirExists('orders/passports');

      const filename = `${Date.now()}-${passportFile.originalname}`;
      const fs = require('fs');
      const path = require('path');
      const fullPath = path.join(process.cwd(), 'uploads', 'orders', 'passports', filename);
      fs.writeFileSync(fullPath, passportFile.buffer);

      createOrderDto.passportImage = this.fileUploadService.getFileUrl(
        filename,
        'orders/passports',
      );
    }

    // Create the order
    const order = this.ordersRepository.create(createOrderDto);
    const savedOrder = await this.ordersRepository.save(order);

    // Workflow 1: Convert Visitor to Client if deposit > 0
    // Moved after save to have order ID for payment
    if (createOrderDto.visitorId) {
      const visitor = await this.visitorsService.findOne(createOrderDto.visitorId);
      if (Number(createOrderDto.deposit) > 0 && visitor.status !== VisitorStatus.CONVERTED) {
        const agreedPrice = Number(createOrderDto.agreedPrice) || 0;
        const newClient = await this.convertVisitorToClient(
          visitor,
          Number(createOrderDto.deposit),
          agreedPrice,
          savedOrder.id
        );

        // Update order with new client
        savedOrder.clientId = newClient.id;
        savedOrder.visitorId = null;
        await this.ordersRepository.save(savedOrder);
      } else {
        // If not converting, update visitor status to INTERESTED
        await this.visitorsService.updateStatus(
          createOrderDto.visitorId,
          VisitorStatus.INTERESTED,
        );
      }
    }

    // Update offer status to RESERVED or SOLD based on order status
    if (offer) {
      const newOfferStatus = createOrderDto.status === OrderStatus.CONFIRMED
        ? OfferStatus.SOLD
        : OfferStatus.RESERVED;
      await this.offersService.update(offer.id, { status: newOfferStatus });
    }

    return this.findOne(savedOrder.id);
  }


  async findAll(
    query: PaginationQueryDto & {
      status?: OrderStatus;
      clientId?: number;
    },
  ): Promise<{ data: Order[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10000, status, clientId } = query;

    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.offer', 'offer')
      .leftJoinAndSelect('offer.images', 'offerImages')
      .leftJoinAndSelect('order.orderedCar', 'orderedCar')
      .leftJoinAndSelect('order.visitor', 'visitor')


      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.documents', 'documents')
      .orderBy('order.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('order.status = :status', { status });
    }

    if (clientId) {
      queryBuilder.andWhere('order.clientId = :clientId', { clientId });
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
      relations: [
        'offer',
        'offer.images',
        'orderedCar',
        'visitor',
        'client',
        'documents',
      ],
    });




    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(
    id: number,
    updateOrderDto: UpdateOrderDto,
    passportFile?: Express.Multer.File,
  ): Promise<Order> {
    const order = await this.findOne(id);

    // Block updates if order is completed or canceled
    // Block updates if order is completed or canceled
    // Exception: Allow updating profit for COMPLETED orders
    const isProfitUpdate = order.status === OrderStatus.COMPLETED && updateOrderDto.profit !== undefined;

    if (
      (order.status === OrderStatus.COMPLETED && !isProfitUpdate) ||
      order.status === OrderStatus.CANCELED
    ) {
      throw new BadRequestException(`Cannot update a ${order.status} order`);
    }

    // Workflow 1: Convert Visitor to Client if deposit > 0 in update
    // Check if order has visitor AND (update has deposit > 0 OR (order has deposit > 0?? No, trigger is change))
    // Simplest: If linked to visitor, and new deposit > 0, convert.
    if (order.visitorId && Number(updateOrderDto.deposit) > 0) {
      const visitor = await this.visitorsService.findOne(order.visitorId);
      if (visitor.status !== VisitorStatus.CONVERTED) {
        // Use updated agreed price if available, else existing
        const agreedPrice = Number(updateOrderDto.agreedPrice) || Number(order.agreedPrice) || 0;

        const newClient = await this.convertVisitorToClient(
          visitor,
          Number(updateOrderDto.deposit),
          agreedPrice,
          order.id
        );
        order.clientId = newClient.id;
        order.visitorId = null; // Unlink visitor
      }
    }


    // Handle passport image upload
    if (passportFile) {
      this.fileUploadService.ensureUploadDirExists('orders/passports');

      const filename = `${Date.now()}-${passportFile.originalname}`;
      const fs = require('fs');
      const path = require('path');
      const fullPath = path.join(process.cwd(), 'uploads', 'orders', 'passports', filename);
      fs.writeFileSync(fullPath, passportFile.buffer);

      updateOrderDto.passportImage = this.fileUploadService.getFileUrl(
        filename,
        'orders/passports',
      );
    }

    // Handle orderedCar update specifically to avoid duplicate key error
    if (updateOrderDto.orderedCar) {
      if (order.orderedCar) {
        // If existing relationship, merge updates into the existing entity
        Object.assign(order.orderedCar, updateOrderDto.orderedCar);
        // Remove from DTO so strict Object.assign below doesn't overwrite with ID-less object
        delete updateOrderDto.orderedCar;
      }
    }

    Object.assign(order, updateOrderDto);
    await this.ordersRepository.save(order);

    // Workflow 2: Update offer status to SOLD if order status becomes CONFIRMED
    if (updateOrderDto.status === OrderStatus.CONFIRMED && order.offerId) {
      await this.offersService.update(order.offerId, {
        status: OfferStatus.SOLD,
      });
    }

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

    // Reset offer status back to AVAILABLE if deleting and offer exists
    if (order.offerId) {
      await this.offersService.update(order.offerId, {
        status: OfferStatus.AVAILABLE,
      });
    }


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

    // Workflow 2: Update offer status to SOLD
    if (order.offerId) {
      await this.offersService.update(order.offerId, {
        status: OfferStatus.SOLD,
      });
    }

    return this.findOne(id);
  }

  async completeOrder(id: number): Promise<Order> {
    const order = await this.findOne(id);

    if (order.status !== OrderStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed orders can be completed');
    }

    order.status = OrderStatus.COMPLETED;
    await this.ordersRepository.save(order);

    // Update offer status to SOLD if offer exists (Redundant if confirmed already sets it, but keeps consistency)
    if (order.offerId) {
      await this.offersService.update(order.offerId, {
        status: OfferStatus.SOLD,
      });
    }


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

    // Reset offer status back to AVAILABLE if offer exists
    if (order.offerId) {
      await this.offersService.update(order.offerId, {
        status: OfferStatus.AVAILABLE,
      });
    }


    // Update visitor status to LOST if linked
    if (order.visitorId) {
      await this.visitorsService.updateStatus(
        order.visitorId,
        VisitorStatus.LOST,
      );
    }

    return this.findOne(id);
  }
  async addDocument(
    id: number,
    createOrderDocumentDto: CreateOrderDocumentDto,
    file: Express.Multer.File,
  ): Promise<OrderDocument> {

    const order = await this.findOne(id);

    // Ensure directory exists
    this.fileUploadService.ensureUploadDirExists('orders/documents');

    const filename = `${Date.now()}-${file.originalname}`;
    const fs = require('fs');
    const path = require('path');
    const fullPath = path.join(process.cwd(), 'uploads', 'orders', 'documents', filename);

    fs.writeFileSync(fullPath, file.buffer);

    const url = this.fileUploadService.getFileUrl(filename, 'orders/documents');

    const document = this.ordersDocumentRepository.create({
      ...createOrderDocumentDto,
      url,
      orderId: order.id,
      name: createOrderDocumentDto.name || file.originalname,
    });

    return this.ordersDocumentRepository.save(document);
  }

  async removeDocument(documentId: number): Promise<void> {
    const document = await this.ordersDocumentRepository.findOne({
      where: { id: documentId },
    });


    if (!document) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    // Extract filename from URL
    const filename = this.fileUploadService.extractFilename(document.url);

    // Delete file
    try {
      await this.fileUploadService.deleteFile(filename, 'orders/documents');
    } catch (e) {
      console.error(`Failed to delete file for document ${documentId}`, e);
    }

    await this.ordersDocumentRepository.remove(document);
  }
}

