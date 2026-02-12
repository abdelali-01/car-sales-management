import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateVisitorInterestDto {
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    priority: number;
}
