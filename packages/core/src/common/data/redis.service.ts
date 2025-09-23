import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

const MESSAGE_QUEUE_KEY = 'kafka-message-queue';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    private client: Redis | undefined;

    async onModuleInit() {
        this.client = new Redis({
            host: '192.168.205.220',
            port: 6379,
        });
        this.logger.log('Redis client connected');
    }

    async onModuleDestroy() {
        await this.client!!.quit();
        this.logger.log('Redis client disconnected');
    }

    async addMessageToQueue(topic: string, message: any): Promise<void> {
        const payload = { topic, message, receivedAt: new Date().toISOString() };
        await this.client!!.rpush(MESSAGE_QUEUE_KEY, JSON.stringify(payload));
    }
    
    async getMessagesFromQueue(batchSize: number): Promise<any[]> {
        const messages = await this.client!!.lrange(MESSAGE_QUEUE_KEY, 0, batchSize - 1);
        if (messages.length > 0) {
            await this.client!!.ltrim(MESSAGE_QUEUE_KEY, messages.length, -1);
        }
        return messages.map(msg => JSON.parse(msg));
    }
}