import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Payment } from '../payments/entities/payment.entity';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) { }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientsRepository.create(createClientDto);
    return this.clientsRepository.save(client);
  }

  async findAll(
    query: PaginationQueryDto & {
      name?: string;
    },
  ): Promise<{ data: Client[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10000, name } = query;

    const queryBuilder = this.clientsRepository
      .createQueryBuilder('client')
      .orderBy('client.createdAt', 'DESC');

    if (name) {
      queryBuilder.andWhere('LOWER(client.name) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Client> {
    const client = await this.clientsRepository.findOne({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);
    Object.assign(client, updateClientDto);
    const saved = await this.clientsRepository.save(client);

    // Sync clientName/clientPhone/clientEmail on all linked orders
    const updateFields: Record<string, string> = {};
    if (updateClientDto.name) updateFields['client_name'] = saved.name;
    if (updateClientDto.phone) updateFields['client_phone'] = saved.phone;
    if (updateClientDto.email !== undefined) updateFields['client_email'] = saved.email;

    if (Object.keys(updateFields).length > 0) {
      await this.ordersRepository
        .createQueryBuilder()
        .update()
        .set(Object.fromEntries(
          Object.entries(updateFields).map(([col, val]) => [
            col === 'client_name' ? 'clientName' : col === 'client_phone' ? 'clientPhone' : 'clientEmail',
            val
          ])
        ))
        .where('clientId = :id', { id })
        .execute();
    }

    return saved;
  }

  async remove(id: number): Promise<void> {
    const client = await this.findOne(id);
    // Nullify client_id on linked orders (orders should remain, just unlinked)
    await this.ordersRepository
      .createQueryBuilder()
      .update()
      .set({ clientId: null })
      .where('clientId = :id', { id })
      .execute();
    // Delete linked payments to avoid FK violation
    await this.paymentsRepository.delete({ clientId: id });
    await this.clientsRepository.remove(client);
  }

  async updateFinancials(
    id: number,
    totalSpent?: number,
    remainingBalance?: number,
  ): Promise<Client> {
    const client = await this.findOne(id);

    if (totalSpent !== undefined) {
      client.totalSpent = totalSpent;
    }

    if (remainingBalance !== undefined) {
      client.remainingBalance = remainingBalance;
    }

    return this.clientsRepository.save(client);
  }
}
