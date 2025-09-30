import { Controller, Logger } from "@nestjs/common";
import { VehicleService } from "../application/vehicle.service";

@Controller()
export class VehicleController {
    private readonly logger: Logger = new Logger(VehicleController.name);

    constructor(
        private readonly vehicleService: VehicleService
    ) {
    }
}