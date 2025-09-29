import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisService } from '../redis/redis.service';
import { KafkaService } from './application/kafka.service';
import { KafkaListener } from './presentation/kafka.listener';
import { LogsService } from "../../modules/logs/application/logs.service";
import { LogsModule } from "../../modules/logs/logs.module";

@Module({
    imports: [
        LogsModule
    ],
    controllers: [KafkaListener],
    providers: [
        KafkaService,
        RedisService
    ],
    exports: [
        KafkaService
    ]
})
export class KafkaModule {}