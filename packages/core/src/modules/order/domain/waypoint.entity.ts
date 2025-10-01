import { Entity, Column, ManyToOne, Index, BeforeInsert, PrimaryColumn, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Orders } from './order.entity';
import { Item } from "./item.entity";
import { Location } from "./location.entity";

export enum WaypointType {
    PICKUP = 'PICKUP',
    DROPOFF = 'DROPOFF',
}

@Entity('waypoints')
export class Waypoint {
    @PrimaryColumn('uuid')
    id: string | undefined;

    @Index()
    @Column({ type: 'enum', enum: WaypointType })
    type: WaypointType | undefined;

    @Column({ type: 'varchar', length: 255 })
    address1: string | undefined;

    @Column({ type: 'varchar', length: 255, nullable: true })
    address2: string | undefined;

    @Column({ type: 'varchar', length: 255, nullable: true })
    postcode: string | undefined;

    @Column(() => Location, { prefix: false })
    location: Location | undefined;

    @OneToMany(() => Item, item => item.waypoint, { cascade: true, eager: true })
    items: Item[] | undefined;

    @Column({ type: 'varchar', length: 255 })
    name: string | undefined;

    @Column({ type: 'varchar', length: 255 })
    phone: string | undefined;

    @Column({ type: 'int', default: 0, nullable: true })
    sequence: number | undefined;

    @ManyToOne(() => Orders, order => order.waypoints)
    order: Orders | undefined;

    @BeforeInsert()
    generateId() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}