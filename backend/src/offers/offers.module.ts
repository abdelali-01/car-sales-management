import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { Offer } from './entities/offer.entity';
import { OfferImage } from './entities/offer-image.entity';
import { FileUploadService } from '../common/services/file-upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([Offer, OfferImage])],
  controllers: [OffersController],
  providers: [OffersService, FileUploadService],
  exports: [OffersService],
})
export class OffersModule { }
