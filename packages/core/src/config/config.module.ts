import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './database/database.config';
import kafkaConfig from './kafka/kafka.config';
import mqttConfig from './mqtt/mqtt.config';
import redisConfig from './redis/redis.config';
import { KafkaLog } from '../modules/kafka/domain/kafka.entity';

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
                entities: [
                    KafkaLog
                ]
            })
        }),
    ],
    exports: [NestConfigModule],
})
export class ConfigModule {}