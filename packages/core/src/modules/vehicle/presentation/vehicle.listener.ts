import { Controller, Logger } from "@nestjs/common";
import { VehicleService } from "../application/vehicle.service";
import { EventPattern, Payload } from "@nestjs/microservices";
import { KafkaService } from "../../../common/kafka/application/kafka.service";
import { VehicleTelemetry } from "../domain/vehicles.entity";

@Controller()
export class VehicleListener {
    private readonly logger: Logger = new Logger(VehicleListener.name);

    constructor(
        private readonly kafkaService: KafkaService,
        private readonly vehicleService: VehicleService
    ) {
    }

    @EventPattern('vehicle.telemetry.raw')
    async handleVehicleTelemetry(@Payload() message: any): Promise<void> {
        try {
            const topic: string = 'vehicle.telemetry.raw';
            this.logger.log(`[${topic}] Message received, queuing to Redis...`);
            await this.kafkaService.queueLogsToRedis(topic, message);

            const vehicleTelemetry: VehicleTelemetry = await this.vehicleService.createVehicleTelemetry(message.value);
            this.logger.log(`[${topic}] VehicleTelemetry : ${JSON.stringify(vehicleTelemetry)}`);
        } catch (error: any) {
            this.logger.error('Error handling vehicle telemetry:', error);
        }
    }
}