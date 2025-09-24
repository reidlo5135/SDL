import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { LogService } from '../../common/data/log.service';
import { BatchService } from "../../common/data/batch.service";
import { RedisService } from "../../common/data/redis.service";
import { KafkaService } from './application/kafka.service';
import { KafkaController } from './presentation/kafka.controller';
import { KafkaLog } from './domain/kafka.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([KafkaLog]),
    ],
    controllers: [KafkaController],
    providers: [
        KafkaService,
        LogService,
        BatchService,
        RedisService,
    ],
    exports: [
        KafkaService
    ]
})
export class KafkaModule {}