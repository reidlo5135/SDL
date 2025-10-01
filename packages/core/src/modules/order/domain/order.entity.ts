import {
    Entity,
    Column,
    BeforeInsert,
    PrimaryColumn,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    Generated, OneToOne, JoinColumn
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { OrderWaypoints } from './order_waypoint.entity';
import { OrderDelivery } from "./order_delivery.entity";

export enum OrderServiceType {
    BIKE = 'BIKE',
    CAR = 'CAR',
    MINIVAN = 'MINIVAN',
}

export enum OrderStatusType {
    RACING = 'RACING',
    SCHEDULED = 'SCHEDULED',
    PICKED_UP = 'PICKED_UP',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED',
}

@Entity('orders')
export class Orders {
    @PrimaryColumn('uuid')
    id: string | undefined;

    @Column({ type: 'varchar', length: 255, nullable: true })
    userId: string | undefined;

    @Generated('uuid')
    objectId: string | undefined;

    @Column({ type: 'varchar', length: 255, nullable: true })
    code: string | undefined;

    @Column({ type: 'varchar', length: 255, nullable: true })
    trackingURL: string | undefined;

    @Column({ type: 'enum', enum: OrderServiceType })
    serviceType: OrderServiceType | undefined;

    @Column({ type: 'timestamp with time zone' })
    pickupTime: Date | undefined;

    @Column(() => OrderDelivery, { prefix: false })
    delivery: OrderDelivery | undefined;

    @OneToMany(() => OrderWaypoints, waypoint => waypoint.order, { cascade: true, eager: true })
    waypoints: OrderWaypoints[] | undefined;

    @Column({ type: 'boolean', default: false, nullable: true })
    geocode: boolean | undefined;

    @Column({ type: 'varchar', length: 255, nullable: true })
    requestId: string | undefined;

    @Column({ type: 'boolean', default: false, nullable: true })
    smsEnabled: boolean | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @UpdateDateColumn()
    updatedAt: Date | undefined;

    @Column({ type: 'varchar', length: 255, nullable: true })
    driverInfo: string | undefined;

    @Column({ type: 'date', nullable: true })
    completedAt: string | undefined;

    @Column({ type: 'enum', enum: OrderStatusType, nullable: true })
    status: string | undefined;

    @Column({ type: 'boolean', default: false, nullable: true })
    pickedUp: boolean | undefined;

    @BeforeInsert()
    generateId() {
        if (!this.id) {
            this.id = uuidv4();
        }
        if(!this.objectId){
            this.objectId = uuidv4();
        }
    }
}