import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LocationEntity } from "../domain/location.entity";
import { Repository } from "typeorm";

@Injectable()
export class LocationService {
    private readonly logger: Logger = new Logger(LocationService.name);

    constructor(
        @InjectRepository(LocationEntity)
        private readonly locationRepository: Repository<LocationEntity>
    ) {
    }
}