import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VehicleEntity } from "../domain/vehicle.entity";
import { Repository } from "typeorm";

@Injectable()
export class VehicleService {
    private readonly logger: Logger = new Logger(VehicleService.name);

    constructor(
        @InjectRepository(VehicleEntity)
        private readonly vehicleRepository: Repository<VehicleEntity>
    ) {
    }

    async createVehicle(vehicle: VehicleEntity): Promise<VehicleEntity> {
        try {
            const newVehicle: VehicleEntity = this.vehicleRepository.create(vehicle);
            return await this.vehicleRepository.save(newVehicle);
        } catch (error: any) {
            this.logger.error('Failed to create vehicle', error);
            throw error;
        }
    }
}