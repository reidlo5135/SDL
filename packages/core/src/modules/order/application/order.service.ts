import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Orders } from "../domain/order.entity";
import { Repository } from "typeorm";
import { OrderCreateDto } from "../domain/dto/order.dto";


@Injectable()
export class OrderService {
    private readonly logger: Logger = new Logger(OrderService.name);

    constructor(
        @InjectRepository(Orders)
        private readonly orderRepository: Repository<Orders>
    ) {
    }

    async createOrder(orderCreateDto: OrderCreateDto): Promise<Orders> {
        try {
            const newOrder: Orders = this.orderRepository.create(orderCreateDto);
            const savedOrder: any = await this.orderRepository.save(newOrder);

            const topic = 'order.event.created';

            return savedOrder;
        } catch (error: any) {
            this.logger.error('Failed to create order', error);
            throw error;
        }
    }
}