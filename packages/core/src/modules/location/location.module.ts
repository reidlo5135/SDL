import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LocationEntity } from "./domain/location.entity";
import { LocationController } from "./presentation/location.controller";
import { LocationService } from "./application/location.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            LocationEntity
        ])
    ],
    controllers: [
        LocationController
    ],
    providers: [
        LocationService
    ],
    exports: [
        LocationService
    ]
})
export class LocationModule {}