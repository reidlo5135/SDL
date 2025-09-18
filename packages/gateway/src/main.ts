import { kafka } from '@sdl/kafka';

const producer = kafka.producer();

const runProducer = async () => {
  try {
    await producer.connect();
    console.log('Producer connected successfully!');

    await producer.send({
      topic: 'mes.production.completed',
      messages: [
        {
          key: 'product-123',
          value: JSON.stringify({
            productId: 'product-123',
            quantity: 100,
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    });

    console.log('Message sent successfully!');
  } catch (error) {
    console.error('Error with producer:', error);
  } finally {
    await producer.disconnect();
  }
};

(async function main(): Promise<void> {
    await runProducer()
        .then(() => console.log('Producer running...'))
        .catch((error) => console.error('Error running producer:', error));
})().catch((e: Error): void => {
    console.error(e);
});