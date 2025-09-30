import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Location } from "../domain/location.entity";
import { Repository } from "typeorm";

@Injectable()
export class LocationService {
    private readonly logger: Logger = new Logger(LocationService.name);

    constructor(
        @InjectRepository(Location)
        private readonly locationRepository: Repository<Location>
    ) {
    }

    async bulkInsertLocations(locations: Location[]): Promise<void> {
        try {
            await this.locationRepository.save(locations);
            this.logger.log(`Successfully inserted ${locations.length} locations to DB.`);
        } catch (error: any) {
            this.logger.error('Failed to bulk insert locations to DB', error);
            throw error;
        }
    }
}