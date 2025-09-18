import {KafkaClient, KafkaProducer} from '@sdl/kafka';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const runKafka = async () => {
    const kafkaClient = new KafkaClient('sdl_gateway', ['192.168.205.220:9092']);

    try {
        const kafkaProducer: KafkaProducer = await kafkaClient.createProducer();

        while (true) {
            await kafkaProducer.produce("mes.production.completed", JSON.stringify({
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
        kafkaClient.getLogger().error(`Error with producer: ${error}`);
    }
};

(async function main(): Promise<void> {
    await runKafka()
        .then(() => console.log('Producer running...'))
        .catch((error) => console.error('Error running producer:', error));
})().catch((e: Error): void => {
    console.error(e);
});