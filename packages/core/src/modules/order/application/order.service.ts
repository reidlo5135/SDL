import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Orders } from "../domain/order.entity";
import { Repository } from "typeorm";
import { ItemDto, OrderCreateRequestDto, WaypointDto } from "../domain/dto/order.dto";
import { Waypoint } from "../domain/waypoint.entity";
import { Location } from "../domain/location.entity";
import { Item } from "../domain/item.entity";

@Injectable()
export class OrderService {
    private readonly logger: Logger = new Logger(OrderService.name);

    constructor(
        @InjectRepository(Orders)
        private readonly orderRepository: Repository<Orders>
    ) {
    }

    async createOrder(orderCreateDto: OrderCreateRequestDto): Promise<Orders> {
        try {
            const newOrder: Orders = new Orders();

            newOrder.pickupTime = new Date(orderCreateDto.pickupTime?.toString() || '');
            newOrder.serviceType = orderCreateDto.serviceType;
            newOrder.delivery = orderCreateDto.delivery;

            newOrder.waypoints = orderCreateDto.waypoints?.map((waypointDto: WaypointDto, index: number): Waypoint => {
                const newWaypoint: Waypoint = new Waypoint();

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
                    newWaypoint.items = waypointDto.items.map((itemDto: ItemDto): Item => {
                        const newItem: Item = new Item();

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

            return this.orderRepository.save(newOrder);
        } catch (error: any) {
            this.logger.error('Failed to create order', error);
            throw error;
        }
    }
}