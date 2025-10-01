import { Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class Location {
    @ApiProperty({ description: '위도' })
    @Column({ type: 'double precision' })
    lat: number | undefined;

    @ApiProperty({ description: '경도' })
    @Column({ type: 'double precision' })
    lng: number | undefined;
}