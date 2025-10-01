import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrderService } from "../application/order.service";
import { KafkaService } from "../../../common/kafka/application/kafka.service";
import { Orders } from "../domain/order.entity";
import { OrderCreateRequestDto, OrderCreateResponseDto } from "../domain/dto/order.dto";
import { KafkaProducer } from "@sdl/kafka";

@Controller('/v1/api/orders')
export class OrderController {
    private readonly logger: Logger = new Logger(OrderController.name);
    private kafkaProducer: KafkaProducer | undefined;

    constructor(
        private readonly kafkaService: KafkaService,
        private readonly orderService: OrderService
    ) {
        this.kafkaService.getClient().createProducer()
            .then(producer => {
                this.kafkaProducer = producer;
            })
            .catch(error => {
                this.logger.error('Failed to create Kafka producer', error);
            });
    }

    @Post('')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: '신규 주문 생성', description: '새로운 주문을 시스템에 등록합니다.' })
    @ApiResponse({ status: 201, description: '주문 생성 성공', type: Orders })
    @ApiResponse({ status: 400, description: '잘못된 요청 파라미터' })
    @ApiResponse({ status: 500, description: '서버 에러' })
    async createOrder(@Body() orderCreateDto: OrderCreateRequestDto): Promise<OrderCreateResponseDto> {
        try {
            const newOrder: Orders = await this.orderService.createOrder(orderCreateDto);

            const orderCreatedTopic: string = 'order.event.created';
            this.kafkaProducer?.produce(orderCreatedTopic, JSON.stringify(newOrder));

            const orderCreateResponseDto: OrderCreateResponseDto = new OrderCreateResponseDto();
            orderCreateResponseDto.placeOrder = newOrder.id;
            return orderCreateResponseDto;
        } catch (error: any) {
            this.logger.error('Failed to create order', error);
            throw error;
        }
    }
}