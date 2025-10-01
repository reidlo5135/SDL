import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Orders } from "../domain/order.entity";
import { Between, Repository } from "typeorm";
import {
    ItemDto,
    OrderCreateRequestDto, OrderCreateResponseDto,
    OrderReadRequestDto,
    OrderReadResponseDto,
    WaypointDto
} from "../domain/dto/order.dto";
import { OrderWaypoints } from "../domain/order_waypoint.entity";
import { Location } from "../domain/order_location.entity";
import { OrderItems } from "../domain/order_item.entity";
import { KafkaService } from "../../../common/kafka/application/kafka.service";
import { KafkaProducer } from "@sdl/kafka";
import { OrderDelivery } from "../domain/order_delivery.entity";

@Injectable()
export class OrderService {
    private readonly logger: Logger = new Logger(OrderService.name);
    private kafkaProducer: KafkaProducer | undefined;

    constructor(
        @InjectRepository(Orders)
        private readonly orderRepository: Repository<Orders>,
        private readonly kafkaService: KafkaService
    ) {
        this.kafkaService.getClient().createProducer()
            .then(producer => {
                this.kafkaProducer = producer;
            })
            .catch(error => {
                this.logger.error('Failed to create Kafka producer', error);
            });
    }

    async getOrders(query: OrderReadRequestDto): Promise<OrderReadResponseDto> {
        const { startDate, endDate } = query;

        const orders: Orders[] = await this.orderRepository.find({
            where: {
                createdAt: Between(new Date(startDate!!), new Date(endDate!!)),
            },
            order: {
                createdAt: 'DESC',
            },
        });

        const transformedOrders: any[] = orders.map(order => ({
            ...order,
            trackingURL: this.generateTrackingUrl(order),
        }));

        return {
            getOrders: transformedOrders,
            statusMessage: "Some of your orders have more than 2 stops, please use get orders API version 2.",
        };
    }

    async createOrder(orderCreateDto: OrderCreateRequestDto): Promise<OrderCreateResponseDto> {
        try {
            const newOrder: Orders = new Orders();

            newOrder.pickupTime = new Date(orderCreateDto.pickupTime?.toString() || '');
            newOrder.serviceType = orderCreateDto.serviceType;

            if (orderCreateDto.delivery) {
                newOrder.delivery = new OrderDelivery();
                newOrder.delivery.type = orderCreateDto.delivery.type;
                newOrder.delivery.price = orderCreateDto.delivery.price;
            }

            newOrder.waypoints = orderCreateDto.waypoints?.map((waypointDto: WaypointDto, index: number): OrderWaypoints => {
                const newWaypoint: OrderWaypoints = new OrderWaypoints();

                newWaypoint.type = waypointDto.type;
                newWaypoint.address1 = waypointDto.address1;
                newWaypoint.address2 = waypointDto.address2;
                newWaypoint.postcode = waypointDto.postcode;
                newWaypoint.name = waypointDto.name;
                newWaypoint.phone = waypointDto.phone;
                newWaypoint.sequence = index + 1;

                if (waypointDto.location) {
                    newWaypoint.location = new Location();
                    newWaypoint.location.lat = parseFloat(waypointDto.location.lat?.toString() || '0');
                    newWaypoint.location.lng = parseFloat(waypointDto.location.lng?.toString() || '0');
                }

                if (waypointDto.items) {
                    newWaypoint.items = waypointDto.items.map((itemDto: ItemDto): OrderItems => {
                        const newItem: OrderItems = new OrderItems();

                        newItem.notes = itemDto.notes;
                        newItem.size = itemDto.size;
                        newItem.category = itemDto.category;
                        newItem.customId = itemDto.customId;

                        return newItem;
                    });
                }

                return newWaypoint;
            });

            newOrder.geocode = orderCreateDto.geocode;
            newOrder.requestId = orderCreateDto.requestId;
            newOrder.smsEnabled = orderCreateDto.smsEnabled;

            const createdOrder: Orders = await this.orderRepository.save(newOrder);

            const orderCreatedTopic: string = 'order.event.created';
            this.kafkaProducer?.produce(orderCreatedTopic, JSON.stringify(createdOrder));

            return {
                placeOrder: newOrder.id,
            };
        } catch (error: any) {
            this.logger.error('Failed to create order', error);
            throw error;
        }
    }

    private generateTrackingUrl(order: Orders): string {
        const baseUrl = 'http://localhost:3000/order';
        return `${baseUrl}/${order.objectId}/?key=${order.code}`;
    }
}