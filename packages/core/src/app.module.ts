import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule as CustomConfigModule } from './config/config.module';
import { KafkaModule } from './common/kafka/kafka.module';
import {LogsModule} from './modules/logs/logs.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        CustomConfigModule,
        KafkaModule,
        LogsModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}