import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsEnum,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../common/enums/order-status.enum';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  offerId: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  visitorId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  clientId?: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  clientName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  clientPhone: string;

  @IsOptional()
  @IsEmail()
  clientEmail?: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  agreedPrice: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  deposit?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  profit?: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
