import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaClient } from '@sdl/kafka';
import { Cron, CronExpression } from "@nestjs/schedule";
import { RedisService } from "../../redis/redis.service";
import { LogsService } from "../../../modules/logs/application/logs.service";

@Injectable()
export class KafkaService {
    private readonly logger: Logger = new Logger(KafkaService.name);
    private readonly kafkaClient: KafkaClient | undefined;
    private readonly kafkaConfig: any | undefined;

    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly logsService: LogsService
    ) {
        try {
            this.kafkaConfig = this.configService.get('kafka');
            const brokers: string[] = [];
            const url: string = `${this.kafkaConfig.host}:${this.kafkaConfig.port}`;
            brokers.push(url);

            this.kafkaClient = new KafkaClient(this.kafkaConfig.clientId, brokers);
            this.logger.log(`Kafka client initialized with brokers: ${brokers}`);
        } catch (error: any) {
            this.logger.error(`Failed to initialize Kafka client: ${error}`);
        }
    }

    public getClient(): KafkaClient {
        if (!this.kafkaClient) {
            throw new Error('KafkaClient is not initialized yet.');
        }
        return this.kafkaClient;
    }

    public async queueLogsToRedis(topic: string, message: any): Promise<void> {
        try {
            this.logger.log(`Adding to Redis Queue message : ${JSON.stringify(message)} which topic : ${topic}`);
            await this.redisService.addMessageToQueue(topic, message);
        } catch (error: any) {
            this.logger.error(`Failed to insert KafkaLogs for ${error}`);
        }
    }

    @Cron(CronExpression.EVERY_5_SECONDS)
    async batchKafkaLogsInsert(): Promise<void> {
        this.logger.debug('Running batch job to process Redis queue...');

        const messages: any[] = await this.redisService.getMessagesFromQueue(this.kafkaConfig.batchSize);

        if (messages.length === 0) {
            this.logger.debug('No messages in queue. Skipping.');
            return;
        }

        this.logger.log(`Processing ${messages.length} messages from Redis queue.`);

        try {
            await this.logsService.bulkInsertLogs(messages);
        } catch (error) {
            this.logger.error(`Batch processing failed. Error: ${error}`);
        }
    }
}