import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { VisitorStatus } from '../../common/enums/visitor-status.enum';
import { VisitorInterestOffer } from './visitor-interest-offer.entity';

@Entity('visitors')
export class Visitor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ name: 'car_brand' })
  carBrand: string;

  @Column({ name: 'car_model' })
  carModel: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  budget: number;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({
    type: 'enum',
    enum: VisitorStatus,
    default: VisitorStatus.NEW,
  })
  status: VisitorStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => VisitorInterestOffer, (interest) => interest.visitor, {
    cascade: true,
  })
  interests: VisitorInterestOffer[];
}
