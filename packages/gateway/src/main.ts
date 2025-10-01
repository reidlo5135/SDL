import { KafkaClient, KafkaProducer } from '@sdl/kafka';
import { MQTTClient } from '@sdl/mqtt';

const bootstrap: () => Promise<void> = async () => {
    const mqttClient: MQTTClient = new MQTTClient('mqtt', '192.168.205.220', 1883, 'mes-gateway-client', 'mes-gateway-client', 'mes-gateway-client');
    const kafkaClient: KafkaClient = new KafkaClient('sdl_gateway', ['192.168.205.220:9092']);

    try {
        const kafkaProducer: KafkaProducer = await kafkaClient.createProducer();

        mqttClient.subscribe('mes.production.completed', 0, (message: string): void => {
            console.info(`Received message: ${JSON.stringify(JSON.parse(message))}`);

            kafkaProducer.produce("mes.production.completed", JSON.stringify({
                key: 'product-123',
                value: JSON.parse(message),
            }));
        });

        mqttClient.subscribe('vehicle.telemetry.raw', 0, (message: string): void => {
            console.info(`Received message: ${JSON.stringify(JSON.parse(message))}`);

            kafkaProducer.produce("vehicle.telemetry.raw", JSON.stringify({
                key: 'vehicle-123',
                value: JSON.parse(message),
            }));
        });
    } catch (error) {
        kafkaClient.getLogger().error(`Error with producer: ${error}`);
    }
}

(async function main(): Promise<void> {
    await bootstrap()
        .then(() => console.log('MQTT & Kafka running...'))
        .catch((error) => console.error('Error running MQTT & Kafka: ', error));
})().catch((e: Error): void => {
    console.error(e);
});