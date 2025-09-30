import { Module } from "@nestjs/common";
import { DriverController } from "./presentation/driver.controller";
import { DriverService } from "./application/driver.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DriverEntity } from "./domain/driver.entity";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            DriverEntity
        ])
    ],
    controllers: [
        DriverController
    ],
    providers: [
        DriverService
    ],
    exports: [
        DriverService
    ]
})
export class DriverModule {}