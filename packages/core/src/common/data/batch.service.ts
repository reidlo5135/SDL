import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RedisService } from './redis.service';
import { LogService } from './log.service';

const BATCH_SIZE = 500;

@Injectable()
export class BatchService {
    private readonly logger = new Logger(BatchService.name);

    constructor(
        private readonly redisService: RedisService,
        private readonly logService: LogService,
    ) {}

    @Cron(CronExpression.EVERY_5_SECONDS)
    async handleCron() {
        this.logger.debug('Running batch job to process Redis queue...');

        const messages = await this.redisService.getMessagesFromQueue(BATCH_SIZE);

        if (messages.length === 0) {
            this.logger.debug('No messages in queue. Skipping.');
            return;
        }

        this.logger.log(`Processing ${messages.length} messages from Redis queue.`);

        try {
            await this.logService.bulkInsertLogs(messages);
        } catch (error) {
            this.logger.error(`Batch processing failed. Error: ${error}`);
        }
    }
}