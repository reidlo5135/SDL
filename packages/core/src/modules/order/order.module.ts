import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity } from "./domain/order.entity";
import { OrderController } from "./presentation/order.controller";
import { OrderService } from "./application/order.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OrderEntity
        ])
    ],
    controllers: [
        OrderController
    ],
    providers: [
        OrderService
    ],
    exports: [
        OrderService
    ]
})
export class OrderModule {}