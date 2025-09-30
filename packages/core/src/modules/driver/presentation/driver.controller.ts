import { Controller, Logger } from "@nestjs/common";
import { DriverService } from "../application/driver.service";

@Controller()
export class DriverController {
    private readonly logger: Logger = new Logger(DriverController.name);

    constructor(
        private readonly driverService: DriverService
    ) {
    }
}