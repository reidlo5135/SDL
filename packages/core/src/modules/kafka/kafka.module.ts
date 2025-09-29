import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchService } from '../../common/job/batch.service';
import { RedisService } from '../../common/core/redis.service';
import { KafkaService } from './application/kafka.service';
import { KafkaController } from './presentation/kafka.controller';
import { KafkaLog } from './domain/kafka.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            KafkaLog
        ]),
    ],
    controllers: [KafkaController],
    providers: [
        KafkaService,
        BatchService,
        RedisService,
    ],
    exports: [
        KafkaService
    ]
})
export class KafkaModule {}