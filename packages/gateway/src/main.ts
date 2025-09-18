import { KafkaClient } from '@sdl/kafka';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const runProducer = async () => {
    const kafkaClient = new KafkaClient('sdl_gateway', ['192.168.205.220:9092']);

    try {
        await kafkaClient.createProducer();

        while (true) {
            await kafkaClient.send("mes.production.completed", JSON.stringify({
                key: 'product-123',
                value: JSON.stringify({
                    productId: 'product-123',
                    quantity: 100,
                    timestamp: new Date().toISOString(),
                }),
            }));
            await sleep(1000);
        }
    } catch (error) {
        kafkaClient.getLogger().error('Error with producer:', error);
    }
};

(async function main(): Promise<void> {
    await runProducer()
        .then(() => console.log('Producer running...'))
        .catch((error) => console.error('Error running producer:', error));
})().catch((e: Error): void => {
    console.error(e);
});