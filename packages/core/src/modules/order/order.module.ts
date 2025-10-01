import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Orders } from "./domain/order.entity";
import { OrderController } from "./presentation/order.controller";
import { OrderService } from "./application/order.service";
import { OrderListener } from "./presentation/order.listener";
import { KafkaModule } from "../../common/kafka/kafka.module";
import { OrderWaypoints } from "./domain/order_waypoint.entity";
import { OrderItems } from "./domain/order_item.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Orders,
            OrderWaypoints,
            OrderItems
        ]),
        KafkaModule
    ],
    controllers: [
        OrderController,
        OrderListener
    ],
    providers: [
        OrderService
    ],
    exports: [
        OrderService
    ]
})
export class OrderModule {}