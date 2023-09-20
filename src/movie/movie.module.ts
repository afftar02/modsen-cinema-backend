import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { CountryModule } from '../country/country.module';
import { ActorModule } from '../actor/actor.module';
import { GenreModule } from '../genre/genre.module';
import { PosterModule } from '../poster/poster.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    CountryModule,
    ActorModule,
    GenreModule,
    PosterModule,
  ],
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService],
})
export class MovieModule {}
