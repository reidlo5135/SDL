import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { KafkaService } from "./common/kafka/application/kafka.service";
import { KafkaStrategy } from "./common/kafka/presentation/kafka.strategy";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap(): Promise<void> {
    const app: INestApplication<any> = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true
    }));

    const swaggerConfig = new DocumentBuilder()
        .setTitle('@sdl/core')
        .setDescription('The @sdl/core API description')
        .setVersion('1.0')
        .addTag('@sdl/core')
        .build();
    const swaggerDocument = () => SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, swaggerDocument);

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
        .then((): void => console.log('Core running...'))
        .catch((error: any): void => console.error(`Error running Core: ${error.message}`));
})().catch((e: Error): void => {
    console.error(e);
});