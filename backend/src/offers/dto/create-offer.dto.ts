import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OfferStatus } from '../../common/enums/offer-status.enum';

export class CreateOfferDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  brand: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  model: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(1900)
  year: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  month?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  day?: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  km: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  location: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  region?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  originCountry?: string;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  ownerName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  ownerPhone: string;

  @IsOptional()
  @IsEnum(OfferStatus)
  status?: OfferStatus;
}
