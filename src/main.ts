import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { WinstonModule } from 'nest-winston';
import { instance } from '../logger/winston.logger';
import initializePipes from './shared/common/helpers/initializePipes';
import initializeSwagger from './shared/common/helpers/initializeSwagger';

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

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
