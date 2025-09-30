import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LogsEntity }  from './domain/logs.entity'
import { LogsService } from "./application/logs.service";
import { LogsController } from "./presentation/logs.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            LogsEntity
        ])
    ],
    controllers: [
        LogsController
    ],
    providers: [
        LogsService
    ],
    exports: [
        LogsService
    ]
})
export class LogsModule {}