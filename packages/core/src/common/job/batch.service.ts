import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from '../core/redis.service';
import { KafkaService } from '../../modules/kafka/application/kafka.service';

const BATCH_SIZE = 500;

@Injectable()
export class BatchService {
    private readonly logger: Logger = new Logger(BatchService.name);

    constructor(
        private readonly redisService: RedisService,
        private readonly kafkaService: KafkaService
    ) {}

    @Cron(CronExpression.EVERY_5_SECONDS)
    async batchKafkaLogsInsert(): Promise<void> {
        this.logger.debug('Running batch job to process Redis queue...');

        const messages: any[] = await this.redisService.getMessagesFromQueue(BATCH_SIZE);

        if (messages.length === 0) {
            this.logger.debug('No messages in queue. Skipping.');
            return;
        }

        this.logger.log(`Processing ${messages.length} messages from Redis queue.`);

        try {
            await this.kafkaService.bulkInsertKafkaLogs(messages);
        } catch (error) {
            this.logger.error(`Batch processing failed. Error: ${error}`);
        }
    }
}