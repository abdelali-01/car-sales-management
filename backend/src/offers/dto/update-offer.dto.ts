import { PartialType } from '@nestjs/mapped-types';
import { CreateOfferDto } from './create-offer.dto';
import { IsOptional, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOfferDto extends PartialType(CreateOfferDto) {
    @IsOptional()
    @IsArray()
    @Type(() => Number)
    deletedImageIds?: number[];
}
