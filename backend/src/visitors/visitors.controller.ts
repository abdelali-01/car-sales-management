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
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { VisitorStatus } from '../common/enums/visitor-status.enum';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('visitors')
@UseGuards(SessionAuthGuard)
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

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
}
