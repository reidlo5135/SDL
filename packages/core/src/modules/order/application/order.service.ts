import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderEntity } from "../domain/order.entity";
import { Repository } from "typeorm";


@Injectable()
export class OrderService {
    private readonly logger: Logger = new Logger(OrderService.name);

    constructor(
        @InjectRepository(OrderEntity)
        private readonly orderRepository: Repository<OrderEntity>
    ) {
    }
}