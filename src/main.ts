import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { WinstonModule } from 'nest-winston';
import { instance } from '../logger/winston.logger';
import { initializePipes } from './shared/common/helpers';
import { initializeSwagger } from './shared/common/helpers';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './shared/common/filters';
import { OrmExceptionFilter } from './shared/common/filters';

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

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new AllExceptionsFilter(httpAdapter),
    new OrmExceptionFilter(),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT');

  await app.listen(port);
}
bootstrap();
