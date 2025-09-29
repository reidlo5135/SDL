import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule as CustomConfigModule } from './config/config.module';
import { KafkaModule } from './modules/kafka/kafka.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        CustomConfigModule,
        KafkaModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}