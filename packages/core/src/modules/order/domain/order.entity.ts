import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('orders')
export class Orders {

    @PrimaryGeneratedColumn()
    order_id: string | undefined;

    @Column({ type: 'varchar', length: 255 })
    status: string | undefined;

    @Column({ type: 'varchar', length: 255 })
    origin_location_id: string | undefined;

    @Column({ type: 'varchar', length: 255 })
    destination_location_id: string | undefined;

    @CreateDateColumn()
    requested_pickup_at: Date | undefined;

    @CreateDateColumn()
    requested_delivery_at: Date | undefined;
}