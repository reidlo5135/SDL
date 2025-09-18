import {Admin, Consumer, Kafka, Logger, Producer} from 'kafkajs'

abstract class KafkaBase {
    protected readonly kafka: Kafka;

    protected constructor(kafka: Kafka) {
        this.kafka = kafka;
    }

    public getLogger(): Logger {
        if (!this.kafka) {
            throw new Error('Kafka client is not initialized');
        }

        return this.kafka.logger();
    }
}

export class KafkaClient extends KafkaBase {

    constructor(clientId: string, brokers: string[]) {
        const kafkaInstance = new Kafka({
            clientId,
            brokers
        });
        super(kafkaInstance);
    }

    public async createConsumer(groupId: string): Promise<KafkaConsumer> {
        return new KafkaConsumer(this.kafka, groupId);
    }

    public async createProducer(): Promise<KafkaProducer> {
        return new KafkaProducer(this.kafka);
    }
}

export class KafkaConsumer extends KafkaBase {
    private readonly consumer?: Consumer;

    constructor(kafka: Kafka, groupId: string) {
        super(kafka);
        this.consumer = this.kafka.consumer({ groupId });
        this.consumer.connect()
            .then(r => this.getLogger().info('Consumer connected successfully!'))
            .catch(e => this.getLogger().error(`Error connecting consumer: ${e}`));
    }

    public async consume(topic: string, callback: (message: string) => void): Promise<void> {
        if (!this.consumer) {
            throw new Error('Consumer is not initialized');
        }

        await this.consumer.subscribe({ topic })
            .then(r => this.getLogger().info(`Consumer subscribed successfully with topic: ${topic}`))
            .catch(e => this.getLogger().error(`Error subscribing to topic: ${e}`));

        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if (message.value) {
                    const receivedMessage = message.value.toString();
                    callback(receivedMessage);
                }
            }
        })
            .then(r => this.getLogger().info('Consumer running successfully!'))
            .catch(e => this.getLogger().error(`Error running consumer: ${e}`));
    }

    public async disconnectConsumer(): Promise<void> {
        if (!this.consumer) {
            throw new Error('Consumer is not initialized');
        }

        this.getLogger().info('Disconnecting consumer...');
        await this.consumer.disconnect()
            .then(r => this.getLogger().info('Consumer disconnected successfully!'))
            .catch(e => this.getLogger().error(`Error disconnecting consumer: ${e}`));
    }
}

export class KafkaProducer extends KafkaBase {
    private readonly producer?: Producer;

    constructor(kafka: Kafka) {
        super(kafka);
        this.producer = this.kafka.producer();
        this.producer.connect().then(r => this.getLogger().info('Producer connected successfully!'));
    }

    public async produce(topic: string, message: string): Promise<void> {
        if (!this.producer) {
            throw new Error('Producer is not initialized');
        }

        this.getLogger().info(`Sending message to topic: ${topic} with value: ${message}`);
        await this.producer.send({
            topic,
            messages: [{ value: message }],
        })
            .then(r => this.getLogger().info('Message sent successfully!'))
            .catch(e => this.getLogger().error('Error sending message:', e));
    }

    public async disconnectProducer(): Promise<void> {
        if (!this.producer) {
            throw new Error('Producer is not initialized');
        }

        this.getLogger().info('Disconnecting producer...');
        await this.producer.disconnect()
            .then(r => this.getLogger().info('Producer disconnected successfully!'))
            .catch(e => this.getLogger().error(`Error disconnecting producer: ${e}`));
    }
}