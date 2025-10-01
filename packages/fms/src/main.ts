import { KafkaClient, KafkaConsumer } from "@sdl/kafka";

async function bootstrap() {
    const kafkaClient: KafkaClient = new KafkaClient('sdl_fms', ['192.168.205.220:9092']);

    try {
        const orderCreatedConsumer: KafkaConsumer = await kafkaClient.createConsumer('order-created-consumer');

        await orderCreatedConsumer.subscribe(['order.event.created']);
        await orderCreatedConsumer.run(async (payload: any) => {
            kafkaClient.getLogger().info(`Received message: ${JSON.stringify(payload)}`);
        });
    } catch (error: any) {
        kafkaClient.getLogger().error(`Error with consumer: ${error}`);
    }
}

(async function main(): Promise<void> {
    await bootstrap()
        .then((): void => console.log('FMS running...'))
        .catch((error: any): void => console.error(`Error running Core: ${error.message}`));
})().catch((e: Error): void => {
    console.error(e);
});