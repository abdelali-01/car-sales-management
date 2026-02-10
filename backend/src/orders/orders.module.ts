import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OffersModule } from '../offers/offers.module';
import { VisitorsModule } from '../visitors/visitors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), OffersModule, VisitorsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
