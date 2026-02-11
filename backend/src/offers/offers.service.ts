import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { OfferImage } from './entities/offer-image.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';
import { OfferStatus } from '../common/enums/offer-status.enum';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(OfferImage)
    private offerImagesRepository: Repository<OfferImage>,
    private cloudinaryService: CloudinaryService,
  ) { }

  async create(
    createOfferDto: CreateOfferDto,
    files?: Express.Multer.File[],
  ): Promise<Offer> {
    const offer = this.offersRepository.create(createOfferDto);
    const savedOffer = await this.offersRepository.save(offer);

    // Upload images if provided
    if (files && files.length > 0) {
      await this.uploadImages(savedOffer.id, files);
    }

    return this.findOne(savedOffer.id);
  }

  async findAll(
    query: PaginationQueryDto & {
      status?: OfferStatus;
      brand?: string;
      location?: string;
    },
  ): Promise<{ data: Offer[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 10, status, brand, location } = query;

    const queryBuilder = this.offersRepository
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.images', 'images')
      .orderBy('offer.createdAt', 'DESC');

    if (status) {
      queryBuilder.andWhere('offer.status = :status', { status });
    }

    if (brand) {
      queryBuilder.andWhere('LOWER(offer.brand) LIKE LOWER(:brand)', {
        brand: `%${brand}%`,
      });
    }

    if (location) {
      queryBuilder.andWhere('LOWER(offer.location) LIKE LOWER(:location)', {
        location: `%${location}%`,
      });
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      where: { id },
      relations: ['images'],
    });

    if (!offer) {
      throw new NotFoundException(`Offer with ID ${id} not found`);
    }

    return offer;
  }

  async update(
    id: number,
    updateOfferDto: UpdateOfferDto,
    files?: Express.Multer.File[],
  ): Promise<Offer> {
    const offer = await this.findOne(id);

    // Block update if offer is sold
    if (offer.status === OfferStatus.SOLD) {
      throw new BadRequestException('Cannot update a sold offer');
    }

    Object.assign(offer, updateOfferDto);
    await this.offersRepository.save(offer);

    // Upload new images if provided
    if (files && files.length > 0) {
      await this.uploadImages(id, files);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const offer = await this.findOne(id);

    // Check if offer is linked to any orders
    // This will be implemented when Orders module is created
    // For now, just check if offer is sold
    if (offer.status === OfferStatus.SOLD) {
      throw new ConflictException('Cannot delete a sold offer');
    }

    // Delete all images from Cloudinary
    if (offer.images && offer.images.length > 0) {
      for (const image of offer.images) {
        if (image.publicId) {
          await this.cloudinaryService.deleteImage(image.publicId);
        }
      }
    }

    await this.offersRepository.remove(offer);
  }

  async uploadImages(
    offerId: number,
    files: Express.Multer.File[],
  ): Promise<OfferImage[]> {
    const offer = await this.findOne(offerId);

    const uploadedImages: OfferImage[] = [];

    for (const file of files) {
      try {
        const result = await this.cloudinaryService.uploadImage(file, 'offers');

        const offerImage = this.offerImagesRepository.create({
          offerId: offer.id,
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });

        const savedImage = await this.offerImagesRepository.save(offerImage);
        uploadedImages.push(savedImage);
      } catch (error) {
        console.error('Error uploading image:', error);
        // Continue with other images even if one fails
      }
    }

    return uploadedImages;
  }

  async removeImage(imageId: number): Promise<void> {
    const image = await this.offerImagesRepository.findOne({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    // Delete from Cloudinary
    if (image.publicId) {
      try {
        await this.cloudinaryService.deleteImage(image.publicId);
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    // Delete from database
    await this.offerImagesRepository.remove(image);
  }
}
