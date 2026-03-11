import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderDocument } from './entities/order-document.entity';
import { OrderedCar } from './entities/ordered-car.entity';
import { Payment } from '../payments/entities/payment.entity';
import { OffersModule } from '../offers/offers.module';
import { VisitorsModule } from '../visitors/visitors.module';
import { FileUploadService } from '../common/services/file-upload.service';
import { ClientsModule } from '../clients/clients.module';
import { PaymentsModule } from '../payments/payments.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDocument, OrderedCar, Payment]),
    OffersModule,
    OffersModule,
    VisitorsModule,
    ClientsModule,
    forwardRef(() => PaymentsModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, FileUploadService],
  exports: [OrdersService],
})

export class OrdersModule { }
