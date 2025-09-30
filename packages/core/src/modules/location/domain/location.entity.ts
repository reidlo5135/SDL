import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('location')
export class Location {

    @PrimaryGeneratedColumn()
    location_id: string | undefined;

    @Column({ type: 'varchar', length: 255 })
    location_name: string | undefined;

    @Column({ type: 'varchar', length: 255 })
    location_type: string | undefined;

    @Column({ type: 'varchar', length: 255 })
    address: string | undefined;

    @Column({ type: 'point' })
    coordinates: string | undefined;

    @Column({ type: 'polygon' })
    geofence_data: string | undefined;
}
