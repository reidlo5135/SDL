import {Injectable, Logger} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaClient } from '@sdl/kafka';

@Injectable()
export class KafkaService  {
    private readonly client: KafkaClient | undefined;
    private readonly logger: Logger = new Logger(KafkaService.name);

    constructor(private readonly configService: ConfigService) {
        const kafkaConfig = this.configService.get('kafka');
        const brokers: string[] = [];
        const url: string = `${kafkaConfig.host}:${kafkaConfig.port}`;
        brokers.push(url);

        this.client = new KafkaClient(kafkaConfig.clientId, brokers);
        this.logger.log(`Kafka client initialized with brokers: ${brokers}`);
    }

    public getClient(): KafkaClient {
        if (!this.client) {
            throw new Error("KafkaClient is not initialized yet.");
        }
        return this.client;
    }
}