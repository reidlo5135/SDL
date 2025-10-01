import {
    IsString, IsNotEmpty, IsEnum, IsArray, ValidateNested, IsOptional, IsDateString, IsNumber, IsLatitude, IsLongitude,
    IsBoolean
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Orders, ServiceType } from '../order.entity';
import { WaypointType } from "../waypoint.entity";

export class LocationDto {
    @ApiProperty({ description: '위도', example: '1.351648' })
    @IsLatitude()
    @IsNotEmpty()
    lat: string | undefined;

    @ApiProperty({ description: '경도', example: '103.970676' })
    @IsLongitude()
    @IsNotEmpty()
    lng: string | undefined;
}

export class ItemDto {
    @ApiProperty({ description: '화물 관련 메모', required: false, example: 'Fragile' })
    @IsString()
    @IsOptional()
    notes?: string | undefined;

    @ApiProperty({ description: '화물 크기', example: 24 })
    @IsNumber()
    @IsNotEmpty()
    size: number | undefined;

    @ApiProperty({ description: '화물 카테고리', example: 'general' })
    @IsString()
    @IsNotEmpty()
    category: string | undefined;

    @ApiProperty({ description: '사용자 지정 화물 ID', example: '1234567' })
    @IsString()
    @IsNotEmpty()
    customId: string | undefined;
}

export class WaypointDto {
    @ApiProperty({ enum: WaypointType, description: '경유지 타입 (픽업/하차)', example: WaypointType.PICKUP })
    @IsEnum(WaypointType)
    @IsNotEmpty()
    type: WaypointType | undefined;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    address1: string | undefined;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    address2: string | undefined;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    postcode: string | undefined;

    @ApiProperty()
    @ValidateNested()
    @Type(() => LocationDto)
    @IsNotEmpty()
    location: LocationDto | undefined;

    @ApiProperty({ type: () => [ItemDto], description: '경유지에서 처리할 화물 목록', required: false })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItemDto)
    @IsOptional()
    items: ItemDto[] | undefined;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string | undefined;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    phone: string | undefined;
}

class DeliveryDto {
    @ApiProperty({ description: '배송 세부 타입', example: 'RACE' })
    @IsString()
    @IsNotEmpty()
    type: string | undefined;

    @ApiProperty({ description: '가격', example: '15.0' })
    @IsString()
    @IsNotEmpty()
    price: string | undefined;
}

export class OrderCreateRequestDto {
    @ApiProperty({ description: '픽업 시간 (ISO 8601)', example: '2025-10-01T14:00:00Z' })
    @IsDateString()
    @IsNotEmpty()
    pickupTime: string | undefined;

    @ApiProperty({ enum: ServiceType, description: '차량 서비스 타입', example: ServiceType.CAR })
    @IsEnum(ServiceType)
    @IsNotEmpty()
    serviceType: ServiceType | undefined;

    @ApiProperty({ type: () => [WaypointDto], description: '경유지 목록' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => WaypointDto)
    @IsNotEmpty()
    waypoints: WaypointDto[] | undefined;

    @ApiProperty({ type: () => DeliveryDto, description: '배송 상세 정보' })
    @ValidateNested()
    @Type(() => DeliveryDto)
    @IsNotEmpty()
    delivery: DeliveryDto | undefined;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    geocode: boolean | undefined;

    @ApiProperty()
    @IsString()
    @IsOptional()
    requestId: string | undefined;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    smsEnabled: boolean | undefined;
}

export class OrderCreateResponseDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    placeOrder: string | undefined;
}

export class OrderReadRequestDto {
    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    startDate: string | undefined;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    endDate: string | undefined;
}

export class OrderReadResponseDto {
    @ApiProperty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Orders)
    @IsNotEmpty()
    getOrders: Orders[] | undefined;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    statusMessage: string | undefined;
}

export class OrderUpdateRequestDto extends PartialType(OrderCreateRequestDto) {}