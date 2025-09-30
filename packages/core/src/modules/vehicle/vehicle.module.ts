import { Module } from "@nestjs/common";
import { VehicleService } from "./application/vehicle.service";
import { VehicleController } from "./presentation/vehicle.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VehicleEntity } from "./domain/vehicle.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            VehicleEntity
        ])
    ],
    controllers: [
        VehicleController
    ],
    providers: [
        VehicleService
    ],
    exports: [
        VehicleService
    ]
})
export class VehicleModule {}