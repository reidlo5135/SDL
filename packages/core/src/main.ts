import { KafkaClient } from '@sdl/kafka';

const runConsumer = async () => {
    const kafkaClient = new KafkaClient('sdl_core', ['192.168.205.220:9092']);

    try {
        await kafkaClient.createConsumer('mes-core-consumer', 'mes.production.completed', (message) => {
            kafkaClient.getLogger().info('Received message:', JSON.parse(message));
        });
    } catch (error) {
        kafkaClient.getLogger().error('Error with consumer:', error);
    }
};

(async function main(): Promise<void> {
    await runConsumer()
        .then(() => console.log('Consumer running...'))
        .catch((error) => console.error('Error running consumer:', error));
})().catch((e: Error): void => {
    console.error(e);
});