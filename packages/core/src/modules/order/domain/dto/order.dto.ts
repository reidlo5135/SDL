import { IsString, IsNotEmpty, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class OrderCreateDto {
    @IsString()
    @IsNotEmpty()
    origin_location_id: string | undefined;

    @IsString()
    @IsNotEmpty()
    destination_location_id: string | undefined;

    @IsDateString()
    @IsOptional()
    requested_pickup_at?: Date;

    @IsDateString()
    @IsOptional()
    requested_delivery_at?: Date;
}

export class OrderUpdateDto {
    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    origin_location_id?: string;

    @IsString()
    @IsOptional()
    destination_location_id?: string;

    @IsDateString()
    @IsOptional()
    requested_pickup_at?: Date;

    @IsDateString()
    @IsOptional()
    requested_delivery_at?: Date;
}