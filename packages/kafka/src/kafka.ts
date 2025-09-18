import {Admin, Consumer, Kafka, Producer} from 'kafkajs'

export class KafkaClient {
    private kafka: Kafka;
    private admin?: Admin;
    private producer?: Producer;
    private consumer?: Consumer;

    constructor(clientId: string, brokers: string[]) {
        this.kafka = new Kafka({
            clientId,
            brokers
        });
    }
    
    public getLogger(): any {
        if (!this.kafka) {
            throw new Error('Kafka client is not initialized');
        }
        
        return this.kafka.logger();
    }

    public createAdmin(): Admin {
        this.admin = this.kafka.admin();
        return this.admin;
    }

    public async createProducer(): Promise<void> {
        this.producer = this.kafka.producer();
        await this.producer.connect();
        this.getLogger().info('Producer connected successfully!');
    }

    public async send(topic: string, message: string): Promise<void> {
        if (!this.producer) {
            throw new Error('Producer is not initialized');
        }

        this.getLogger().info(`Sending message to topic: ${topic} with value: ${message}`);
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
        await this.producer.disconnect();
        this.getLogger().info('Producer disconnected successfully!');
    }

    public async createConsumer(groupId: string, topic: string, callback: (message: string) => void): Promise<void> {
        this.consumer = this.kafka.consumer({ groupId });

        await this.consumer.connect();
        this.getLogger().info(`Consumer connected successfully with groupId: ${groupId}`);

        await this.consumer.subscribe({ topic });
        this.getLogger().info(`Subscribed to topic: ${topic}`);

        await this.consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if (message.value) {
                    const receivedMessage = message.value.toString();
                    callback(receivedMessage);
                }
            }
        });
    }
}