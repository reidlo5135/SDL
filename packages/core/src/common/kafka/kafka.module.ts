import { Module } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { KafkaService } from './application/kafka.service';
import { LogsModule } from "../../modules/logs/logs.module";
import { VehicleModule } from "../../modules/vehicle/vehicle.module";

@Module({
    imports: [
        LogsModule
    ],
    controllers: [],
    providers: [
        KafkaService,
        RedisService
    ],
    exports: [
        KafkaService
    ]
})
export class KafkaModule {}