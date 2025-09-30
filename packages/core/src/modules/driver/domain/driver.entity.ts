import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('drivers')
export class Drivers {

    @PrimaryGeneratedColumn()
    driver_id: string | undefined;

    @Column({ type: 'varchar', length: 255 })
    name: string | undefined;

    @Column({ type: 'varchar', length: 255 })
    contact_info: string | undefined;

    @Column({ type: 'varchar', length: 255 })
    status: string | undefined;
}