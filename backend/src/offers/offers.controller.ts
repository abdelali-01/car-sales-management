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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { SessionAuthGuard } from '../auth/guards/session-auth.guard';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { OfferStatus } from '../common/enums/offer-status.enum';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('offers')
@UseGuards(SessionAuthGuard)
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10))
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const offer = await this.offersService.create(createOfferDto, files);
    return ApiResponseDto.success(offer, 'Offer created successfully');
  }

  @Get()
  async findAll(
    @Query()
    query: PaginationQueryDto & {
      status?: OfferStatus;
      brand?: string;
      location?: string;
    },
  ) {
    const result = await this.offersService.findAll(query);
    return ApiResponseDto.success(result.data, undefined, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: Math.ceil(result.total / result.limit),
    });
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const offer = await this.offersService.findOne(id);
    return ApiResponseDto.success(offer);
  }

  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images', 10))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOfferDto: UpdateOfferDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    const offer = await this.offersService.update(id, updateOfferDto, files);
    return ApiResponseDto.success(offer, 'Offer updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.offersService.remove(id);
    return ApiResponseDto.success(null, 'Offer deleted successfully');
  }

  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadImages(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      return ApiResponseDto.error('No images provided');
    }

    const images = await this.offersService.uploadImages(id, files);
    return ApiResponseDto.success(images, 'Images uploaded successfully');
  }

  @Delete('images/:imageId')
  async removeImage(@Param('imageId', ParseIntPipe) imageId: number) {
    await this.offersService.removeImage(imageId);
    return ApiResponseDto.success(null, 'Image deleted successfully');
  }
}
