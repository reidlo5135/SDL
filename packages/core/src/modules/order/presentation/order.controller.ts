import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { OrderService } from "../application/order.service";
import { KafkaService } from "../../../common/kafka/application/kafka.service";
import { Orders } from "../domain/order.entity";
import {
    OrderCreateRequestDto,
    OrderCreateResponseDto,
    OrderReadRequestDto,
    OrderReadResponseDto
} from "../domain/dto/order.dto";

@Controller('/v1/api/orders')
export class OrderController {
    private readonly logger: Logger = new Logger(OrderController.name);

    constructor(
        private readonly kafkaService: KafkaService,
        private readonly orderService: OrderService
    ) {
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: '기간별 주문 조회', description: '지정된 시작일과 종료일 사이의 주문 내역을 조회합니다.' })
    @ApiResponse({
        status: 200,
        description: '주문 조회 성공',
        type: OrderReadResponseDto,
    })
    async getOrders(@Query() query: OrderReadRequestDto): Promise<OrderReadResponseDto> {
        try {
            return this.orderService.getOrders(query);
        } catch (error: any) {
            this.logger.error('Failed to get orders', error);
            throw error;
        }
    }

    @Post('')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: '신규 주문 생성', description: '새로운 주문을 시스템에 등록합니다.' })
    @ApiResponse({ status: 201, description: '주문 생성 성공', type: Orders })
    @ApiResponse({ status: 400, description: '잘못된 요청 파라미터' })
    @ApiResponse({ status: 500, description: '서버 에러' })
    async createOrder(@Body() orderCreateDto: OrderCreateRequestDto): Promise<OrderCreateResponseDto> {
        try {
            return this.orderService.createOrder(orderCreateDto);
        } catch (error: any) {
            this.logger.error('Failed to create order', error);
            throw error;
        }
    }
}