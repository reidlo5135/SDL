import {KafkaClient, KafkaConsumer} from '@sdl/kafka';

const runKafka = async () => {
    const kafkaClient = new KafkaClient('sdl_core', ['192.168.205.220:9092']);

    try {
        const kafkaConsumer: KafkaConsumer = await kafkaClient.createConsumer('mes-core-consumer');
        await kafkaConsumer.consume('mes.production.completed', (message: string): void => {
            kafkaClient.getLogger().info('Received message:', JSON.parse(message));
        });
    } catch (error) {
        kafkaClient.getLogger().error(`Error with consumer: ${error}`);
    }
};

(async function main(): Promise<void> {
    await runKafka()
        .then(() => console.log('Consumer running...'))
        .catch((error) => console.error('Error running consumer:', error));
})().catch((e: Error): void => {
    console.error(e);
});