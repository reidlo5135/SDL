import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { KafkaService } from '../application/kafka.service';

@Controller()
export class KafkaListener {
    private readonly logger: Logger = new Logger(KafkaListener.name);

    constructor(
        private readonly kafkaService: KafkaService
    ) {}

    @EventPattern('mes.production.completed')
    async handleProductionCompleted(@Payload() message: any): Promise<void> {
        const topic: string = 'mes.production.completed';
        this.logger.log(`[${topic}] Message received, queuing to Redis...`);
        await this.kafkaService.queueLogsToRedis(topic, message);
    }

    @EventPattern('vehicle.telemetry.raw')
    async handleVehicleTelemetry(@Payload() message: any): Promise<void> {
        const topic: string = 'vehicle.telemetry.raw';
        this.logger.log(`[${topic}] Message received, queuing to Redis...`);
        await this.kafkaService.queueLogsToRedis(topic, message);
    }
}