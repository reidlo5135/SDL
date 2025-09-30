import { Controller, Logger } from "@nestjs/common";
import { OrderService } from "../application/order.service";

@Controller()
export class OrderController {
    private readonly logger: Logger = new Logger(OrderController.name);

    constructor(
        private readonly orderService: OrderService
    ) {
    }
}