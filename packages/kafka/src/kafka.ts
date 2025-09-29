import {Consumer, EachMessagePayload, Kafka, Logger, Producer} from 'kafkajs'

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

    public async subscribe(topics: string[]): Promise<void> {
        if (!this.consumer) {
            throw new Error('Consumer is not initialized');
        }
        await this.consumer.subscribe({ topics, fromBeginning: true });
        this.getLogger().info(`Consumer subscribed successfully with topics: ${topics.join(', ')}`);
    }

    public async run(eachMessageCallback: (payload: EachMessagePayload) => Promise<void>): Promise<void> {
        if (!this.consumer) {
            throw new Error('Consumer is not initialized');
        }
        await this.consumer.run({
            eachMessage: eachMessageCallback
        });
    }

    public async disconnectConsumer(): Promise<void> {
        if (!this.consumer) {
            throw new Error('Consumer is not initialized');
        }

        await this.consumer.disconnect();
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

        await this.producer.send({
            topic,
            messages: [{ value: message }],
        });
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