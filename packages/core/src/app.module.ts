import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule as CustomConfigModule } from './config/config.module';
import { KafkaModule } from './common/kafka/kafka.module';
import {LogsModule} from './modules/logs/logs.module';
import { VehicleModule } from "./modules/vehicle/vehicle.module";
import { DriverModule } from "./modules/driver/driver.module";
import { LocationModule } from "./modules/location/location.module";
import { OrderModule } from "./modules/order/order.module";

@Module({
    imports: [
        ScheduleModule.forRoot(),
        CustomConfigModule,
        KafkaModule,
        LogsModule,
        VehicleModule,
        DriverModule,
        LocationModule,
        OrderModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}