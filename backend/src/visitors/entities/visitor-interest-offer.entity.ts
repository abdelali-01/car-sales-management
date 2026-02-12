import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Visitor } from './visitor.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity('visitor_interest_offers')
export class VisitorInterestOffer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'visitor_id' })
    visitorId: number;

    @Column({ name: 'offer_id' })
    offerId: number;

    @Column({ type: 'int', default: 1 })
    priority: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToOne(() => Visitor, (visitor) => visitor.interests, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'visitor_id' })
    visitor: Visitor;

    @ManyToOne(() => Offer, (offer) => offer.interestedVisitors)
    @JoinColumn({ name: 'offer_id' })
    offer: Offer;
}
