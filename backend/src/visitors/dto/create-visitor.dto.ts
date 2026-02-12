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
import { VisitorStatus } from '../../common/enums/visitor-status.enum';

export class CreateVisitorDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  phone: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  carBrand: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  carModel: string;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  budget: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsEnum(VisitorStatus)
  status?: VisitorStatus;
}
