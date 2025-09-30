import { Controller, Logger } from "@nestjs/common";
import { LocationService } from "../application/location.service";

@Controller()
export class LocationController {
    private readonly logger: Logger = new Logger(LocationController.name);

    constructor(
        private readonly locationService: LocationService
    ) {
    }
}