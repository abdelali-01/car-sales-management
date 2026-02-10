import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrderStatus } from '../../common/enums/order-status.enum';
import { Offer } from '../../offers/entities/offer.entity';
import { Visitor } from '../../visitors/entities/visitor.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'offer_id' })
  offerId: number;

  @Column({ name: 'visitor_id', nullable: true })
  visitorId: number;

  @Column({ name: 'client_name' })
  clientName: string;

  @Column({ name: 'client_phone' })
  clientPhone: string;

  @Column({ name: 'client_email', nullable: true })
  clientEmail: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'agreed_price' })
  agreedPrice: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  deposit: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  profit: number;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Offer, { nullable: false })
  @JoinColumn({ name: 'offer_id' })
  offer: Offer;

  @ManyToOne(() => Visitor, { nullable: true })
  @JoinColumn({ name: 'visitor_id' })
  visitor: Visitor;
}
