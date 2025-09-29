import {Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KafkaClient, KafkaConsumer } from '@sdl/kafka';
import { Cron, CronExpression } from "@nestjs/schedule";
import { RedisService } from "../../redis/redis.service";
import { LogsService } from "../../../modules/logs/application/logs.service";

const BATCH_SIZE = 500;

@Injectable()
export class KafkaService {
    private readonly logger: Logger = new Logger(KafkaService.name);
    private readonly kafkaClient: KafkaClient | undefined;

    constructor(
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly logsService: LogsService
    ) {
        try {
            const kafkaConfig: any = this.configService.get('kafka');
            const brokers: string[] = [];
            const url: string = `${kafkaConfig.host}:${kafkaConfig.port}`;
            brokers.push(url);

            this.kafkaClient = new KafkaClient(kafkaConfig.clientId, brokers);
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

    public async createConsumer(groupId: string): Promise<KafkaConsumer> {
        try {
            if (!this.kafkaClient) {
                throw new Error('KafkaClient is not initialized yet.');
            }

            return await this.kafkaClient.createConsumer(groupId);
        } catch (error: any) {
            this.logger.error(`Failed to create consumer: ${error}`);
            throw error;
        }
    }

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
            await this.logsService.bulkInsertLogs(messages);
        } catch (error) {
            this.logger.error(`Batch processing failed. Error: ${error}`);
        }
    }
}