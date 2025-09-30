import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DriverEntity } from "../domain/driver.entity";
import { Repository } from "typeorm";

@Injectable()
export class DriverService {
    private readonly logger: Logger = new Logger(DriverService.name);

    constructor(
        @InjectRepository(DriverEntity)
        private readonly driverRepository: Repository<DriverEntity>
    ) {
    }
}