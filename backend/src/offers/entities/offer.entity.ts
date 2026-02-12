import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { OfferStatus } from '../../common/enums/offer-status.enum';
import { OfferImage } from './offer-image.entity';
import { VisitorInterestOffer } from '../../visitors/entities/visitor-interest-offer.entity';

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  km: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  price: number;

  @Column()
  location: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ name: 'owner_name' })
  ownerName: string;

  @Column({ name: 'owner_phone' })
  ownerPhone: string;

  @Column({
    type: 'enum',
    enum: OfferStatus,
    default: OfferStatus.AVAILABLE,
  })
  status: OfferStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => OfferImage, (image) => image.offer, { cascade: true })
  images: OfferImage[];

  @OneToMany(() => VisitorInterestOffer, (interest) => interest.offer)
  interestedVisitors: VisitorInterestOffer[];
}
