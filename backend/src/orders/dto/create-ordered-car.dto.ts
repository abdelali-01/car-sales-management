import {
    IsNotEmpty,
    IsString,
    IsNumber,
    IsOptional,
    Min,
    Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderedCarDto {
    @IsNotEmpty()
    @IsString()
    brand: string;

    @IsNotEmpty()
    @IsString()
    model: string;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Min(1900)
    @Max(new Date().getFullYear() + 1)
    year: number;

    @IsNotEmpty()
    @IsString()
    color: string;

    @IsOptional()
    @IsString()
    vin?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
