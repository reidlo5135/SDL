import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('vehicles')
export class VehicleEntity {
    @PrimaryGeneratedColumn()
    id: number | undefined;
}