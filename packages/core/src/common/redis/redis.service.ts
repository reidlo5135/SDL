import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from "@nestjs/config";

const MESSAGE_QUEUE_KEY = 'kafka-message-queue';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger: Logger = new Logger(RedisService.name);
    private redisClient: Redis | undefined;

    constructor(private readonly configService: ConfigService) {}

    async onModuleInit(): Promise<void> {
        try {
            const redisConfig: any = this.configService.get('redis');
            this.redisClient = new Redis({
                host: redisConfig.host,
                port: redisConfig.port,
            });
            this.logger.log(`Redis client connected with ${redisConfig.host}:${redisConfig.port}`);
        } catch (error: any) {
            this.logger.error('Redis client connected with error:', error);
        }
    }

    async onModuleDestroy(): Promise<void> {
        await this.redisClient!!.quit();
        this.logger.log('Redis redisClient disconnected');
    }

    async addMessageToQueue(topic: string, message: any): Promise<void> {
        const payload: any = { topic, message, receivedAt: new Date().toISOString() };
        await this.redisClient!!.rpush(MESSAGE_QUEUE_KEY, JSON.stringify(payload));
    }
    
    async getMessagesFromQueue(batchSize: number): Promise<any[]> {
        const messages: string[] = await this.redisClient!!.lrange(MESSAGE_QUEUE_KEY, 0, batchSize - 1);
        if (messages.length > 0) {
            await this.redisClient!!.ltrim(MESSAGE_QUEUE_KEY, messages.length, -1);
        }
        return messages.map(msg => JSON.parse(msg));
    }
}