import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';


import { OrderStatus } from '../../common/enums/order-status.enum';
import { OrderType } from '../../common/enums/order-type.enum';
import { ProcessStatus } from '../../common/enums/process-status.enum';

import { Offer } from '../../offers/entities/offer.entity';
import { Visitor } from '../../visitors/entities/visitor.entity';
import { Client } from '../../clients/entities/client.entity';
import { OrderDocument } from './order-document.entity';
import { OrderedCar } from './ordered-car.entity';




@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'offer_id', nullable: true })
  offerId: number | null;


  @Column({ name: 'visitor_id', nullable: true })
  visitorId: number | null;

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

  @Column({
    type: 'enum',
    enum: OrderType,
    nullable: true,
  })
  type: OrderType;

  @Column({
    type: 'enum',
    enum: ProcessStatus,
    default: ProcessStatus.PENDING,
    name: 'process_status',
  })
  processStatus: ProcessStatus;

  @Column({ name: 'delivery_company', nullable: true })
  deliveryCompany: string;

  @Column({ name: 'container_id', nullable: true })
  containerId: string;

  @Column({ name: 'passport_image', nullable: true })
  passportImage: string;

  @OneToMany(() => OrderDocument, (document) => document.order, {
    cascade: true,
  })
  documents: OrderDocument[];


  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Offer, { nullable: true })
  @JoinColumn({ name: 'offer_id' })
  offer: Offer;


  @ManyToOne(() => Visitor, { nullable: true })
  @JoinColumn({ name: 'visitor_id' })
  visitor: Visitor;

  @Column({ name: 'client_id', nullable: true })
  clientId: number | null;

  @ManyToOne(() => Client, (client) => client.orders, { nullable: true })
  @JoinColumn({ name: 'client_id' })
  client: Client;

  @OneToOne(() => OrderedCar, (orderedCar) => orderedCar.order, {
    cascade: true,
  })
  orderedCar: OrderedCar;
}

