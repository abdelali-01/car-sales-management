import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('statistics')
@UseGuards(SessionAuthGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('overview')
  async getOverview() {
    const data = await this.statisticsService.getOverview();
    return ApiResponseDto.success(data);
  }

  @Get('monthly-sales')
  async getMonthlySales(@Query('year', ParseIntPipe) year?: number) {
    const data = await this.statisticsService.getMonthlySales(year);
    return ApiResponseDto.success(data);
  }

  @Get('conversion-rate')
  async getConversionRate() {
    const data = await this.statisticsService.getConversionRate();
    return ApiResponseDto.success(data);
  }

  @Get('offers-by-status')
  async getOffersByStatus() {
    const data = await this.statisticsService.getOffersByStatus();
    return ApiResponseDto.success(data);
  }

  @Get('revenue')
  async getRevenue() {
    const data = await this.statisticsService.getRevenue();
    return ApiResponseDto.success(data);
  }

  @Get('recent-activity')
  async getRecentActivity(@Query('limit', ParseIntPipe) limit?: number) {
    const data = await this.statisticsService.getRecentActivity(limit);
    return ApiResponseDto.success(data);
  }
}
