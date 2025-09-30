import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post } from "@nestjs/common";
import { OrderService } from "../application/order.service";
import { KafkaService } from "../../../common/kafka/application/kafka.service";
import { Orders } from "../domain/order.entity";
import { OrderCreateDto } from "../domain/dto/order.dto";

@Controller('/v1/api/orders')
export class OrderController {
    private readonly logger: Logger = new Logger(OrderController.name);

    constructor(
        private readonly kafkaService: KafkaService,
        private readonly orderService: OrderService
    ) {
    }

    @Post('')
    @HttpCode(HttpStatus.CREATED)
    async createOrder(@Body() orderCreateDto: OrderCreateDto): Promise<Orders> {
        try {
            const newOrder: Orders = await this.orderService.createOrder(orderCreateDto);
            return newOrder;
        } catch (error: any) {
            this.logger.error('Failed to create order', error);
            throw error;
        }
    }
}