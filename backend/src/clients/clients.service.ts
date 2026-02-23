import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
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
    return this.clientsRepository.save(client);
  }

  async remove(id: number): Promise<void> {
    const client = await this.findOne(id);
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
