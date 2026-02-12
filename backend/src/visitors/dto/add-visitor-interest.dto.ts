import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddVisitorInterestDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    offerId: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    priority?: number;
}
