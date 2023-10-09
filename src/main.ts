import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationPipe,
  ValidationError,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { WinstonModule } from 'nest-winston';
import { instance } from '../logger/winston.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: false,
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });

  app.enableCors({ credentials: true, origin: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = validationErrors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        }));

        return new BadRequestException(errors);
      },
    }),
  );
  app.use('/uploads', express.static('uploads'));

  const config = new DocumentBuilder()
    .setTitle('Cinema-modsen')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
    },
  });

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
