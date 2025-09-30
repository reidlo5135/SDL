import { Module } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { KafkaService } from './application/kafka.service';
import { KafkaListener } from './presentation/kafka.listener';
import { LogsModule } from "../../modules/logs/logs.module";

@Module({
    imports: [
        LogsModule
    ],
    controllers: [
        KafkaListener
    ],
    providers: [
        KafkaService,
        RedisService
    ],
    exports: [
        KafkaService
    ]
})
export class KafkaModule {}