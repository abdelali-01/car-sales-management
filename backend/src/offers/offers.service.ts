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
import { FileUploadService } from '../common/services/file-upload.service';
import { OfferStatus } from '../common/enums/offer-status.enum';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    @InjectRepository(OfferImage)
    private offerImagesRepository: Repository<OfferImage>,
    private fileUploadService: FileUploadService,
  ) {
    // Ensure upload directory exists
    this.fileUploadService.ensureUploadDirExists('offers');
  }

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

    Object.assign(offer, updateOfferDto);
    await this.offersRepository.save(offer);

    // Handle deleted images
    if (updateOfferDto.deletedImageIds && updateOfferDto.deletedImageIds.length > 0) {
      for (const imageId of updateOfferDto.deletedImageIds) {
        try {
          await this.removeImage(imageId);
        } catch (error) {
          console.error(`Error removing image ${imageId}:`, error);
        }
      }
    }

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

    // Delete all images from filesystem
    if (offer.images && offer.images.length > 0) {
      const filenames = offer.images
        .filter((img) => img.publicId) // publicId now stores filename
        .map((img) => img.publicId);

      if (filenames.length > 0) {
        try {
          await this.fileUploadService.deleteMultipleFiles(
            filenames,
            'offers',
          );
        } catch (error) {
          console.error('Error deleting images from filesystem:', error);
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
        // File is already saved by Multer, we just need to create the database record
        const imageUrl = this.fileUploadService.getFileUrl(
          file.filename,
          'offers',
        );

        const offerImage = this.offerImagesRepository.create({
          offerId: offer.id,
          imageUrl: imageUrl,
          publicId: file.filename, // Store filename for deletion
        });

        const savedImage = await this.offerImagesRepository.save(offerImage);
        uploadedImages.push(savedImage);
      } catch (error) {
        console.error('Error saving image record:', error);
        // Delete the uploaded file if database save fails
        try {
          await this.fileUploadService.deleteFile(file.filename, 'offers');
        } catch (deleteError) {
          console.error('Error deleting orphaned file:', deleteError);
        }
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

    // Delete from filesystem
    if (image.publicId) {
      try {
        await this.fileUploadService.deleteFile(image.publicId, 'offers');
      } catch (error) {
        console.error('Error deleting image from filesystem:', error);
      }
    }

    // Delete from database
    await this.offerImagesRepository.remove(image);
  }
}
