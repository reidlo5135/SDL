import { Module } from "@nestjs/common";
import { VehicleService } from "./application/vehicle.service";
import { VehicleController } from "./presentation/vehicle.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Vehicles, VehicleTelemetry } from "./domain/vehicles.entity";
import { KafkaModule } from "../../common/kafka/kafka.module";
import { VehicleListener } from "./presentation/vehicle.listener";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Vehicles,
            VehicleTelemetry
        ]),
        KafkaModule
    ],
    controllers: [
        VehicleController,
        VehicleListener
    ],
    providers: [
        VehicleService
    ],
    exports: [
        VehicleService
    ]
})
export class VehicleModule {}