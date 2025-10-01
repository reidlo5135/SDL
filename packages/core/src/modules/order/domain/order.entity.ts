import { Entity, Column, BeforeInsert, PrimaryColumn, OneToMany, CreateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Waypoint } from './waypoint.entity';

export enum ServiceType {
    BIKE = 'BIKE',
    CAR = 'CAR',
    MINIVAN = 'MINIVAN',
}

@Entity('orders')
export class Orders {
    @PrimaryColumn('uuid')
    id: string | undefined;

    @Column({ type: 'enum', enum: ServiceType })
    serviceType: ServiceType | undefined;

    @Column({ type: 'timestamp with time zone' })
    pickupTime: Date | undefined;

    @Column({ type: 'jsonb' })
    delivery: Record<string, any> | undefined;

    @OneToMany(() => Waypoint, waypoint => waypoint.order, { cascade: true, eager: true })
    waypoints: Waypoint[] | undefined;

    @Column({ type: 'boolean', default: false, nullable: true })
    geocode: boolean | undefined;

    @Column({ type: 'varchar', length: 255, nullable: true })
    requestId: string | undefined;

    @Column({ type: 'boolean', default: false, nullable: true })
    smsEnabled: boolean | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;

    @BeforeInsert()
    generateId() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}