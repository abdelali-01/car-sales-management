import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visitor } from './entities/visitor.entity';
import { VisitorInterestOffer } from './entities/visitor-interest-offer.entity';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { AddVisitorInterestDto } from './dto/add-visitor-interest.dto';
import { UpdateVisitorInterestDto } from './dto/update-visitor-interest.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { VisitorStatus } from '../common/enums/visitor-status.enum';
import { OffersService } from '../offers/offers.service';

@Injectable()
export class VisitorsService {
  constructor(
    @InjectRepository(Visitor)
    private visitorsRepository: Repository<Visitor>,
    @InjectRepository(VisitorInterestOffer)
    private visitorInterestRepository: Repository<VisitorInterestOffer>,
    private offersService: OffersService,
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
    const { page = 1, limit = 10000, status, carBrand } = query;

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

  async findByOffer(offerId: number): Promise<Visitor[]> {
    // Query visitors who have this offer in their interests
    const interests = await this.visitorInterestRepository.find({
      where: { offerId },
      relations: ['visitor'],
      order: { priority: 'ASC' },
    });

    // Extract unique visitors and attach their interest details
    const visitors = interests.map(interest => ({
      ...interest.visitor,
      interestPriority: interest.priority,
      interestAddedAt: interest.createdAt,
    }));

    return visitors;
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

  // Interest management methods
  async addInterest(
    visitorId: number,
    addInterestDto: AddVisitorInterestDto,
  ): Promise<VisitorInterestOffer> {
    // Verify visitor exists
    await this.findOne(visitorId);

    // Verify offer exists
    await this.offersService.findOne(addInterestDto.offerId);

    // Check if interest already exists
    const existingInterest = await this.visitorInterestRepository.findOne({
      where: {
        visitorId,
        offerId: addInterestDto.offerId,
      },
    });

    if (existingInterest) {
      throw new ConflictException(
        `Visitor already has interest in offer ${addInterestDto.offerId}`,
      );
    }

    // Auto-increment priority if not provided
    let priority = addInterestDto.priority;
    if (!priority) {
      // Find the highest priority for this visitor
      const maxPriorityResult = await this.visitorInterestRepository
        .createQueryBuilder('interest')
        .select('MAX(interest.priority)', 'maxPriority')
        .where('interest.visitorId = :visitorId', { visitorId })
        .getRawOne();

      priority = (maxPriorityResult?.maxPriority || 0) + 1;
    }

    const interest = this.visitorInterestRepository.create({
      visitorId,
      offerId: addInterestDto.offerId,
      priority,
    });

    return this.visitorInterestRepository.save(interest);
  }

  async getVisitorInterests(visitorId: number): Promise<VisitorInterestOffer[]> {
    // Verify visitor exists
    await this.findOne(visitorId);

    return this.visitorInterestRepository.find({
      where: { visitorId },
      relations: ['offer', 'offer.images'],
      order: { priority: 'ASC' },
    });
  }

  async updateInterestPriority(
    visitorId: number,
    offerId: number,
    updateDto: UpdateVisitorInterestDto,
  ): Promise<VisitorInterestOffer> {
    const interest = await this.visitorInterestRepository.findOne({
      where: { visitorId, offerId },
    });

    if (!interest) {
      throw new NotFoundException(
        `Interest not found for visitor ${visitorId} and offer ${offerId}`,
      );
    }

    const oldPriority = interest.priority;
    const newPriority = updateDto.priority;

    // Find the interest that currently has the target priority
    const targetInterest = await this.visitorInterestRepository.findOne({
      where: { visitorId, priority: newPriority },
    });

    // Use a transaction to swap priorities atomically
    await this.visitorInterestRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // If there's an item at the target priority, swap them
        if (targetInterest) {
          // Temporarily set to a high number to avoid unique constraint violation
          targetInterest.priority = 9999;
          await transactionalEntityManager.save(targetInterest);

          // Update the moving item to new priority
          interest.priority = newPriority;
          await transactionalEntityManager.save(interest);

          // Update the displaced item to old priority
          targetInterest.priority = oldPriority;
          await transactionalEntityManager.save(targetInterest);
        } else {
          // No item at target priority, just update
          interest.priority = newPriority;
          await transactionalEntityManager.save(interest);
        }
      },
    );

    return interest;
  }

  async removeInterest(visitorId: number, offerId: number): Promise<void> {
    const interest = await this.visitorInterestRepository.findOne({
      where: { visitorId, offerId },
    });

    if (!interest) {
      throw new NotFoundException(
        `Interest not found for visitor ${visitorId} and offer ${offerId}`,
      );
    }

    await this.visitorInterestRepository.remove(interest);
  }
}
