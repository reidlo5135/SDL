import { Injectable, Logger } from "@nestjs/common";
import { LogsEntity } from "../domain/logs.entity";
import { InjectRepository }   from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class LogsService {
    private readonly logger: Logger = new Logger(LogsService.name);

    constructor(
        @InjectRepository(LogsEntity)
        private readonly logsEntityRepository: Repository<LogsEntity>,
    ) {
    }

    async bulkInsertLogs(messages: Array<{ topic: string; message: any }>): Promise<void> {
        try {
            const logsEntities: LogsEntity[] = messages.map(msg =>
                this.logsEntityRepository.create({
                    topic: msg.topic,
                    message: msg.message,
                })
            );

            await this.logsEntityRepository.save(logsEntities);
            this.logger.log(`Successfully inserted ${messages.length} logs to DB.`);

        } catch (error: any) {
            this.logger.error('Failed to bulk insert logs to DB', error);
            throw error;
        }
    }
}