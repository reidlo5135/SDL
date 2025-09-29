import { Server, CustomTransportStrategy, MessageHandler } from '@nestjs/microservices';
import { KafkaClient, KafkaConsumer } from '@sdl/kafka';
import { KafkaService } from './kafka.service';

export class KafkaStrategy extends Server implements CustomTransportStrategy {
    private kafkaConsumer: KafkaConsumer | undefined;

    constructor(private readonly kafkaService: KafkaService) {
        super();
    }

    public async listen(callback: () => void): Promise<void> {
        this.kafkaConsumer = await this.kafkaService.createConsumer('mes-core-consumer');

        const registeredPatterns: string[] = [...this.messageHandlers.keys()];
        this.logger.log(`Subscribing to topics: ${registeredPatterns.join(', ')}`);

        for (const topic of registeredPatterns) {
            const handler: MessageHandler<any, any, any> | undefined = this.messageHandlers.get(topic);
            if (handler) {
                await this.kafkaConsumer.consume(topic, async (message: string): Promise<void> => {
                    try {
                        const parsedMessage: any = JSON.parse(message);
                        await handler(parsedMessage);
                    } catch (error) {
                        this.logger.error(`Error handling message for topic ${topic}:`, error);
                    }
                });
            }
        }
        callback();
    }

    public async close(): Promise<void> {
        if (this.kafkaConsumer) {
            await this.kafkaConsumer.disconnectConsumer();
        }
    }

    on<EventKey extends string = string, EventCallback extends Function = Function>(event: EventKey, callback: EventCallback) {
        throw new Error('Method not implemented.');
    }

    unwrap<T>(): T {
        throw new Error('Method not implemented.');
    }
}