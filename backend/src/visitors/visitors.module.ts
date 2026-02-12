import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitorsService } from './visitors.service';
import { VisitorsController } from './visitors.controller';
import { Visitor } from './entities/visitor.entity';
import { VisitorInterestOffer } from './entities/visitor-interest-offer.entity';
import { OffersModule } from '../offers/offers.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Visitor, VisitorInterestOffer]),
    OffersModule,
  ],
  controllers: [VisitorsController],
  providers: [VisitorsService],
  exports: [VisitorsService],
})
export class VisitorsModule { }
