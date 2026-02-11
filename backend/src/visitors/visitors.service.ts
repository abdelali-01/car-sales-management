import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visitor } from './entities/visitor.entity';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { VisitorStatus } from '../common/enums/visitor-status.enum';

@Injectable()
export class VisitorsService {
  constructor(
    @InjectRepository(Visitor)
    private visitorsRepository: Repository<Visitor>,
  ) { }

  async create(createVisitorDto: CreateVisitorDto): Promise<Visitor> {
    const visitor = this.visitorsRepository.create(createVisitorDto);
    return this.visitorsRepository.save(visitor);
  }

  async findAll(
    query: PaginationQueryDto & {
      status?: VisitorStatus;
      carBrand?: string;
    },
  ): Promise<{ data: Visitor[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, status, carBrand } = query;

    const queryBuilder = this.visitorsRepository
      .createQueryBuilder('visitor')
      .orderBy('visitor.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('visitor.status = :status', { status });
    }

    if (carBrand) {
      queryBuilder.andWhere('LOWER(visitor.car_brand) LIKE LOWER(:carBrand)', {
        carBrand: `%${carBrand}%`,
      });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Visitor> {
    const visitor = await this.visitorsRepository.findOne({
      where: { id },
    });

    if (!visitor) {
      throw new NotFoundException(`Visitor with ID ${id} not found`);
    }

    return visitor;
  }

  async update(
    id: number,
    updateVisitorDto: UpdateVisitorDto,
  ): Promise<Visitor> {
    const visitor = await this.findOne(id);
    Object.assign(visitor, updateVisitorDto);
    return this.visitorsRepository.save(visitor);
  }

  async remove(id: number): Promise<void> {
    const visitor = await this.findOne(id);
    await this.visitorsRepository.remove(visitor);
  }

  async updateStatus(id: number, status: VisitorStatus): Promise<Visitor> {
    const visitor = await this.findOne(id);
    visitor.status = status;
    return this.visitorsRepository.save(visitor);
  }
}
