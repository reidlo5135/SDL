import { Kafka } from 'kafkajs'

export const kafka = new Kafka({
    clientId: 'sdl-core',
    brokers: ['192.168.205.220:9092']
});