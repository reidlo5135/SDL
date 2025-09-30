import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('logs_kafka')
export class Logs {
    @PrimaryGeneratedColumn()
    id: number | undefined;

    @Column({ type: 'varchar', length: 255 })
    topic: string | undefined;

    @Column({ type: 'jsonb' })
    message: Record<string, any> | undefined;

    @CreateDateColumn()
    createdAt: Date | undefined;
}