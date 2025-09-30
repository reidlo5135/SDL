import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Point } from 'typeorm';
import { PointTransformer } from "../../../common/utils/math.utils";

@Entity('vehicles')
export class Vehicles {
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

@Entity('vehicle_telemetry')
export class VehicleTelemetry {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column({ type: 'varchar', length: 255 })
    vehicle_id: string | undefined;

    @Column({
        type: 'point',
        transformer: new PointTransformer()
    })
    coordinates: Point | undefined;

    @Column({ type: 'int' })
    speed_kmh: number | undefined;

    @Column({ type: 'jsonb' })
    obd_data: Record<string, any> | undefined;

    @CreateDateColumn()
    timestamp: Date | undefined;
}