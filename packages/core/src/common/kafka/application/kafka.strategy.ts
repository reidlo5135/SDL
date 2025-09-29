import { Server, CustomTransportStrategy, MessageHandler } from '@nestjs/microservices';
import { KafkaConsumer } from '@sdl/kafka';
import { KafkaService } from './kafka.service';
import { EachMessagePayload } from "@nestjs/microservices/external/kafka.interface";

export class KafkaStrategy extends Server implements CustomTransportStrategy {
    private kafkaConsumer: KafkaConsumer | undefined;

    constructor(
        private readonly kafkaService: KafkaService
    ) {
        super();
    }

    public async listen(callback: () => void): Promise<void> {
        try {
            this.kafkaConsumer = await this.kafkaService.getClient().createConsumer('sdl-core-consumer');

            const topicsToSubscribe: string[] = [...this.messageHandlers.keys()];

            await this.kafkaConsumer.subscribe(topicsToSubscribe);
            await this.kafkaConsumer.run(async (payload: EachMessagePayload) => {
                const { topic, message } = payload;
                const handler: MessageHandler | undefined = this.messageHandlers.get(topic);
                if (handler && message.value) {
                    const parsedMessage = JSON.parse(message.value.toString());
                    await handler(parsedMessage);
                }
            });

            callback();
        } catch (error: any) {
            this.logger.error('Error initializing Kafka consumer:', error);
        }
    }

    public async close(): Promise<void> {
        if (this.kafkaConsumer) {
            await this.kafkaConsumer.disconnectConsumer();
        }
    }

    on<EventKey extends string = string, EventCallback extends Function = Function>(event: EventKey, callback: EventCallback): void {
        throw new Error('Method not implemented.');
    }

    unwrap<T>(): T {
        throw new Error('Method not implemented.');
    }
}