import { Controller, Logger } from "@nestjs/common";
import { KafkaService } from "../../../common/kafka/application/kafka.service";
import { OrderService } from "../application/order.service";
import { EventPattern } from "@nestjs/microservices";

@Controller()
export class OrderListener {
    private readonly logger: Logger = new Logger(OrderListener.name);

    constructor(
        private readonly kafkaService: KafkaService,
        private readonly orderService: OrderService
    ) {
    }

    @EventPattern('order.event.created')
    async handleOrderCreated(message: any): Promise<void> {
        const topic: string = 'order.event.created';
        this.logger.log(`[${topic}] Message received, queuing to Redis...`);
        await this.kafkaService.queueLogsToRedis(topic, message);
    }
}