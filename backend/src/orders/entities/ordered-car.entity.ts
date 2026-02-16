import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('ordered_cars')
export class OrderedCar {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    brand: string;

    @Column()
    model: string;

    @Column()
    year: number;

    @Column()
    color: string;

    @Column({ nullable: true })
    vin: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'order_id' })
    orderId: number;

    @OneToOne(() => Order, (order) => order.orderedCar, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
