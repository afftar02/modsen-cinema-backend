import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewModule } from './review/review.module';
import { Review } from './review/entities/review.entity';
import { ConfigModule } from '@nestjs/config';
import { CountryModule } from './country/country.module';
import { Country } from './country/entities/country.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Review, Country],
      synchronize: true,
    }),
    ReviewModule,
    CountryModule,
  ],
})
export class AppModule {}
