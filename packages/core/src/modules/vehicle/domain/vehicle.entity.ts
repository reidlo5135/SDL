import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('vehicles')
export class VehicleEntity {
    @PrimaryGeneratedColumn()
    vehicle_id: number | undefined;

    @Column({ type: 'varchar', length: 255 })
    license_plate: string | undefined;

    @Column({ type: 'varchar', length: 255 })
    vehicle_type: string | undefined;

    @Column({ type: 'int'})
    capacity_kg: number | undefined;

    @Column({ type:'varchar', length: 255 })
    status: string | undefined;

    @Column({ type: 'varchar', length: 255 })
    default_driver_id: string | undefined;

    @Column({ type: 'jsonb' })
    metadata: Record<string, any> | undefined;

    @CreateDateColumn()
    created_at: Date | undefined;
}