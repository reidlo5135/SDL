import { Entity, PrimaryColumn, Column, ManyToOne, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Waypoint } from './waypoint.entity';

@Entity('items')
export class Item {
    @PrimaryColumn('uuid')
    id: string | undefined;

    @Column({ type: 'varchar', nullable: true })
    notes: string | undefined;

    @Column({ type: 'int' })
    size: number | undefined;

    @Column({ type: 'varchar', length: 255 })
    category: string | undefined;

    @Column({ type: 'varchar', unique: true })
    customId: string | undefined;

    @ManyToOne(() => Waypoint, waypoint => waypoint.items)
    waypoint: Waypoint | undefined;

    @BeforeInsert()
    generateId() {
        if (!this.id) {
            this.id = uuidv4();
        }
    }
}