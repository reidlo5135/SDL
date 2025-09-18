import { kafka } from '@sdl/kafka';

const consumer = kafka.consumer({ groupId: 'sdl-core-group' });

const runConsumer = async () => {
    try {
        await consumer.connect();
        console.log('Consumer connected successfully!');

        await consumer.subscribe({ topic: 'mes.production.completed', fromBeginning: true });
        console.log('Subscribed to topic: mes.production.completed');

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if (message.value) {
                    const receivedMessage = message.value.toString();
                    console.log({
                        topic,
                        partition,
                        offset: message.offset,
                        value: JSON.parse(receivedMessage),
                    });
                }
            },
        });
    } catch (error) {
        console.error('Error with consumer:', error);
    }
};

(async function main(): Promise<void> {
    await runConsumer()
        .then(() => console.log('Consumer running...'))
        .catch((error) => console.error('Error running consumer:', error));
})().catch((e: Error): void => {
    console.error(e);
});