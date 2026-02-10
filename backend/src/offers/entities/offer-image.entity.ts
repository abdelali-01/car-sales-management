import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Offer } from './offer.entity';

@Entity('offer_images')
export class OfferImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'offer_id' })
  offerId: number;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'public_id', nullable: true })
  publicId: string;

  @ManyToOne(() => Offer, (offer) => offer.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'offer_id' })
  offer: Offer;
}
