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
import { VisitorsService } from './visitors.service';
import { CreateVisitorDto } from './dto/create-visitor.dto';
import { UpdateVisitorDto } from './dto/update-visitor.dto';
import { AddVisitorInterestDto } from './dto/add-visitor-interest.dto';
import { UpdateVisitorInterestDto } from './dto/update-visitor-interest.dto';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { VisitorStatus } from '../common/enums/visitor-status.enum';
import { VisitorInterestOffer } from './entities/visitor-interest-offer.entity';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('visitors')
@UseGuards(SessionAuthGuard)
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) { }

  @Post()
  async create(@Body() createVisitorDto: CreateVisitorDto) {
    const visitor = await this.visitorsService.create(createVisitorDto);
    return ApiResponseDto.success(visitor, 'Visitor created successfully');
  }

  @Get()
  async findAll(
    @Query()
    query: PaginationQueryDto & {
      status?: VisitorStatus;
      carBrand?: string;
    },
  ) {
    const result = await this.visitorsService.findAll(query);
    return ApiResponseDto.success(result.data, undefined, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / result.limit),
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const visitor = await this.visitorsService.findOne(id);
    return ApiResponseDto.success(visitor);
  }

  @Get('by-offer/:offerId')
  async findByOffer(@Param('offerId', ParseIntPipe) offerId: number) {
    const visitors = await this.visitorsService.findByOffer(offerId);
    return ApiResponseDto.success(visitors);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVisitorDto: UpdateVisitorDto,
  ) {
    const visitor = await this.visitorsService.update(id, updateVisitorDto);
    return ApiResponseDto.success(visitor, 'Visitor updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.visitorsService.remove(id);
    return ApiResponseDto.success(null, 'Visitor deleted successfully');
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: VisitorStatus,
  ) {
    const visitor = await this.visitorsService.updateStatus(id, status);
    return ApiResponseDto.success(
      visitor,
      'Visitor status updated successfully',
    );
  }

  // Interest management endpoints
  @Post(':id/interests')
  async addInterest(
    @Param('id', ParseIntPipe) id: number,
    @Body() addInterestDto: AddVisitorInterestDto,
  ) {
    const interest = await this.visitorsService.addInterest(id, addInterestDto);
    return ApiResponseDto.success(interest, 'Interest added successfully');
  }

  @Get(':id/interests')
  async getInterests(@Param('id', ParseIntPipe) id: number) {
    const interests = await this.visitorsService.getVisitorInterests(id);
    return ApiResponseDto.success(interests);
  }

  @Patch(':id/interests/:offerId')
  async updateInterestPriority(
    @Param('id', ParseIntPipe) id: number,
    @Param('offerId', ParseIntPipe) offerId: number,
    @Body() updateDto: UpdateVisitorInterestDto,
  ) {
    const interest = await this.visitorsService.updateInterestPriority(
      id,
      offerId,
      updateDto,
    );
    return ApiResponseDto.success(
      interest,
      'Interest priority updated successfully',
    );
  }

  @Delete(':id/interests/:offerId')
  async removeInterest(
    @Param('id', ParseIntPipe) id: number,
    @Param('offerId', ParseIntPipe) offerId: number,
  ) {
    await this.visitorsService.removeInterest(id, offerId);
    return ApiResponseDto.success(null, 'Interest removed successfully');
  }
}
