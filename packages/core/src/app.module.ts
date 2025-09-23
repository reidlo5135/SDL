import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from "@nestjs/schedule";
import { KafkaModule } from "./modules/kafka/kafka.module";
import { KafkaLog } from "./modules/kafka/domain/kafka.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: '192.168.205.220',
            port: 5432,
            username: 'admin',
            password: 'smc1234!',
            database: 'sdl',
            entities: [
                KafkaLog
            ],
            synchronize: true,
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env'
        }),
        ScheduleModule.forRoot(),
        KafkaModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}