import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:8000',
    credentials: true,
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('jwt token')
    .setDescription('This is a jwt token API description')
    .setVersion('1.0')
    .addTag('funtions')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8000);
}

bootstrap();
