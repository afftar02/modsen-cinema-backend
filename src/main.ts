import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { WinstonModule } from 'nest-winston';
import { instance } from '../logger/winston.logger';
import initializePipes from './shared/common/helpers/initializePipes';
import initializeSwagger from './shared/common/helpers/initializeSwagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });

  app.enableCors({ credentials: true, origin: true });
  initializePipes(app);
  app.use('/uploads', express.static('uploads'));
  initializeSwagger(app);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');

  await app.listen(port);
}
bootstrap();
