import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Orders } from "./order.entity";

export class OrderDelivery {
    @Column({ type: 'varchar', length: 255, nullable: true })
    type: string | undefined;

    @Column({ type: 'varchar', length: 255, nullable: true })
    price: string | undefined;

    @Column({ type: 'varchar', length: 255, nullable: true })
    provider: string | undefined;

    @Column({ type: 'varchar', length: 255, nullable: true })
    delivery_id: string | undefined;
}