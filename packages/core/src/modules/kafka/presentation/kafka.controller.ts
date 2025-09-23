import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RedisService } from '../../../common/data/redis.service';

@Controller()
export class KafkaController {
    private readonly logger: Logger = new Logger(KafkaController.name);

    constructor(private readonly redisService: RedisService) {}

    @EventPattern('mes.production.completed')
    async handleProductionCompleted(@Payload() message: any): Promise<void> {
        const topic: string = 'mes.production.completed';
        this.logger.log(`[${topic}] Message received, queuing to Redis...`);
        await this.redisService.addMessageToQueue(topic, message);
    }
}