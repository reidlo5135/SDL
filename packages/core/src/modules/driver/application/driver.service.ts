import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Drivers } from "../domain/driver.entity";
import { Repository } from "typeorm";

@Injectable()
export class DriverService {
    private readonly logger: Logger = new Logger(DriverService.name);

    constructor(
        @InjectRepository(Drivers)
        private readonly driverRepository: Repository<Drivers>
    ) {
    }
}