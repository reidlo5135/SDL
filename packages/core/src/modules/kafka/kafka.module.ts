import { Module } from '@nestjs/common';
import { KafkaProviders } from './application/kafka.provider';
import { LogService } from '../../common/data/log.service';
import { BatchService } from "../../common/data/batch.service";
import { RedisService } from "../../common/data/redis.service";
import { KafkaController } from './presentation/kafka.controller';
import { KafkaLog } from './domain/kafka.entity';
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forFeature([KafkaLog]),
    ],
    controllers: [KafkaController],
    providers: [
        ...KafkaProviders,
        LogService,
        BatchService,
        RedisService,
    ],
    exports: []
})
export class KafkaModule {}