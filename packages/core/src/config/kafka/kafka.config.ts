import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
    host: process.env.KAFKA_HOST,
    port: parseInt(process.env.KAFKA_PORT!!, 10) || 9092,
    clientId: process.env.KAFKA_CLIENT_ID
}));