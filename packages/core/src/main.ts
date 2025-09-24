import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { KafkaStrategy } from "./modules/kafka/application/kafka.strategy";
import {KafkaService} from "./modules/kafka/application/kafka.service";

async function bootstrap(): Promise<void> {
    const app: INestApplication<any> = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true
    }));

    const kafkaService: KafkaService = app.get(KafkaService);
    app.connectMicroservice({
        strategy: new KafkaStrategy(kafkaService),
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