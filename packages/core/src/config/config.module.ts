import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './database/database.config';
import kafkaConfig from './kafka/kafka.config';
import mqttConfig from './mqtt/mqtt.config';
import redisConfig from './redis/redis.config';
import { Logs } from "../modules/logs/domain/logs.entity";
import { Drivers } from "../modules/driver/domain/driver.entity";
import { Location } from "../modules/location/domain/location.entity";
import { Vehicles, VehicleTelemetry } from "../modules/vehicle/domain/vehicles.entity";
import { Orders } from "../modules/order/domain/order.entity";
import { Waypoint } from "../modules/order/domain/waypoint.entity";
import { Item } from "../modules/order/domain/item.entity";

@Module({
    imports: [
        NestConfigModule.forRoot({
            isGlobal: true,
            load: [
                databaseConfig,
                kafkaConfig,
                mqttConfig,
                redisConfig
            ],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                ...configService.get('database'),
                entities: [__dirname + '/../../**/*.entity{.ts,.js}']
                // entities: [
                //     Logs,
                //     Drivers,
                //     Location,
                //     Vehicles,
                //     VehicleTelemetry,
                //     Orders,
                //     Waypoint,
                //     Item
                // ]
            })
        }),
    ],
    exports: [NestConfigModule],
})
export class ConfigModule {}