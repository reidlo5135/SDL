import { Provider } from '@nestjs/common';
import { KafkaClient, KafkaProducer } from '@sdl/kafka';
import { KAFKA_CLIENT, KAFKA_PRODUCER } from '../domain/kafka.constants';

export const KafkaProviders: Provider[] = [
    {
        provide: KAFKA_CLIENT,
        useFactory: () => {
            return new KafkaClient('sdl_core', ['192.168.205.220:9092']);
        },
    },
    {
        provide: KAFKA_PRODUCER,
        useFactory: async (client: KafkaClient): Promise<KafkaProducer> => {
            return await client.createProducer();
        },
        inject: [KAFKA_CLIENT],
    },
];