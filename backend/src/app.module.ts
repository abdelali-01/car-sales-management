import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';
import { OffersModule } from './offers/offers.module';
import { VisitorsModule } from './visitors/visitors.module';
import { OrdersModule } from './orders/orders.module';
import { ClientsModule } from './clients/clients.module';
import { PaymentsModule } from './payments/payments.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: ['error'],
      }),
      inject: [ConfigService],
    }),

    // Serve static files (uploaded images)
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // Authentication and Authorization
    AuthModule,
    AdminsModule,

    // Feature modules
    OffersModule,
    VisitorsModule,
    OrdersModule,
    ClientsModule,
    PaymentsModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
