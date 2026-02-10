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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('clients')
@UseGuards(SessionAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    const client = await this.clientsService.create(createClientDto);
    return ApiResponseDto.success(client, 'Client created successfully');
  }

  @Get()
  async findAll(
    @Query()
    query: PaginationQueryDto & {
      name?: string;
    },
  ) {
    const result = await this.clientsService.findAll(query);
    return ApiResponseDto.success(result.data, undefined, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / result.limit),
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const client = await this.clientsService.findOne(id);
    return ApiResponseDto.success(client);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    const client = await this.clientsService.update(id, updateClientDto);
    return ApiResponseDto.success(client, 'Client updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.clientsService.remove(id);
    return ApiResponseDto.success(null, 'Client deleted successfully');
  }

  @Patch(':id/financials')
  async updateFinancials(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { totalSpent?: number; remainingBalance?: number },
  ) {
    const client = await this.clientsService.updateFinancials(
      id,
      body.totalSpent,
      body.remainingBalance,
    );
    return ApiResponseDto.success(
      client,
      'Client financials updated successfully',
    );
  }
}
