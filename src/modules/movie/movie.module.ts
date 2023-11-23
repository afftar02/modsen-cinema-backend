import { Logger, Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities';
import { CountryModule } from '../country/country.module';
import { ActorModule } from '../actor/actor.module';
import { GenreModule } from '../genre/genre.module';
import { PosterModule } from '../poster/poster.module';
import { TrailerModule } from '../trailer/trailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    CountryModule,
    ActorModule,
    GenreModule,
    PosterModule,
    TrailerModule,
  ],
  controllers: [MovieController],
  providers: [MovieService, Logger],
  exports: [MovieService],
})
export class MovieModule {}
