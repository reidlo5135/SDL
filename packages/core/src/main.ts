import {KafkaClient } from '@sdl/kafka';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import { KafkaStrategy } from "./modules/kafka/application/kafka.strategy";
import { KAFKA_CLIENT } from './modules/kafka/domain/kafka.constants';

async function bootstrap(): Promise<void> {
    const app: INestApplication<any> = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true
    }));

    const kafkaClient: KafkaClient = app.get<KafkaClient>(KAFKA_CLIENT);
    app.connectMicroservice({
        strategy: new KafkaStrategy(kafkaClient),
    });

    await app.startAllMicroservices();
    await app.listen(3000);
    console.log(`Server running... ${await app.getUrl()}`);
}

(async function main(): Promise<void> {
    await bootstrap()
        .then(() => console.log('Core running...'))
        .catch((error) => console.error('Error running Core: ', error));
})().catch((e: Error): void => {
    console.error(e);
});