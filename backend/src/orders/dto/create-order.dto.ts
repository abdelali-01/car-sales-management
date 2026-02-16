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
import { OrderType } from '../../common/enums/order-type.enum';
import { ProcessStatus } from '../../common/enums/process-status.enum';
import { CreateOrderedCarDto } from './create-ordered-car.dto';
import { ValidateNested } from 'class-validator';



export class CreateOrderDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offerId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateOrderedCarDto)
  orderedCar?: CreateOrderedCarDto;


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

  @IsNotEmpty()
  @IsEnum(OrderType)
  type: OrderType;

  @IsOptional()
  @IsEnum(ProcessStatus)
  processStatus?: ProcessStatus;

  @IsOptional()
  @IsString()
  deliveryCompany?: string;

  @IsOptional()
  @IsString()
  containerId?: string;

  @IsOptional()
  @IsString()
  passportImage?: string;
}

