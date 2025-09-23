import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KafkaLog } from '../../modules/kafka/domain/kafka.entity';

@Injectable()
export class LogService {
    private readonly logger = new Logger(LogService.name);

    constructor(
        @InjectRepository(KafkaLog)
        private readonly logRepository: Repository<KafkaLog>,
    ) {}

    async bulkInsertLogs(messages: Array<{ topic: string; message: any }>): Promise<void> {
        try {
            const logsToInsert = messages.map(msg =>
                this.logRepository.create({
                    topic: msg.topic,
                    message: msg.message,
                })
            );

            await this.logRepository.save(logsToInsert);
            this.logger.log(`Successfully inserted ${messages.length} logs to DB.`);

        } catch (error: any) {
            this.logger.error('Failed to bulk insert logs to DB', error);
            throw error;
        }
    }
}