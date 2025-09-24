import { registerAs } from '@nestjs/config';

export default registerAs('mqtt', () => ({
    host: process.env.MQTT_HOST,
    port: parseInt(process.env.MQTT_PORT!!, 10) || 9092,
    clientId: process.env.MQTT_CLIENT_ID,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
}));