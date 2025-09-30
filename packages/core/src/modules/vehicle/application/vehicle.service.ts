import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Vehicles, VehicleTelemetry } from "../domain/vehicles.entity";
import { Repository } from "typeorm";

@Injectable()
export class VehicleService {
    private readonly logger: Logger = new Logger(VehicleService.name);

    constructor(
        @InjectRepository(Vehicles)
        private readonly vehicleRepository: Repository<Vehicles>,

        @InjectRepository(VehicleTelemetry)
        private readonly vehicleTelemetryRepository: Repository<VehicleTelemetry>,
    ) {
    }

    public async createVehicle(vehicle: Vehicles): Promise<Vehicles> {
        try {
            const newVehicle: Vehicles = this.vehicleRepository.create(vehicle);
            return await this.vehicleRepository.save(newVehicle);
        } catch (error: any) {
            this.logger.error('Failed to create vehicle', error);
            throw error;
        }
    }

    public async createVehicleTelemetry(vehicleTelemetry: VehicleTelemetry): Promise<VehicleTelemetry> {
        try {
            const newVehicleTelemetry: VehicleTelemetry = this.vehicleTelemetryRepository.create(vehicleTelemetry);
            return await this.vehicleTelemetryRepository.save(newVehicleTelemetry);
        } catch (error: any) {
            this.logger.error('Failed to create vehicle telemetry', error);
            throw error;
        }
    }
}