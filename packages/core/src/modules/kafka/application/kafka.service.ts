import {Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KafkaClient, KafkaConsumer } from '@sdl/kafka';
import { KafkaLog } from '../../kafka/domain/kafka.entity';

@Injectable()
export class KafkaService {
    private readonly logger: Logger = new Logger(KafkaService.name);
    private readonly kafkaClient: KafkaClient | undefined;

    constructor(
        @InjectRepository(KafkaLog)
        private readonly kafkaLogRepository: Repository<KafkaLog>,
        private readonly configService: ConfigService
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

    async bulkInsertKafkaLogs(messages: Array<{ topic: string; message: any }>): Promise<void> {
        try {
            const kafkaLogs: KafkaLog[] = messages.map(msg =>
                this.kafkaLogRepository.create({
                    topic: msg.topic,
                    message: msg.message,
                })
            );

            await this.kafkaLogRepository.save(kafkaLogs);
            this.logger.log(`Successfully inserted ${messages.length} logs to DB.`);

        } catch (error: any) {
            this.logger.error('Failed to bulk insert logs to DB', error);
            throw error;
        }
    }
}