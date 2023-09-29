import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewModule } from './review/review.module';
import { Review } from './review/entities/review.entity';
import { ConfigModule } from '@nestjs/config';
import { CountryModule } from './country/country.module';
import { Country } from './country/entities/country.entity';
import { ActorModule } from './actor/actor.module';
import { Actor } from './actor/entities/actor.entity';
import { GenreModule } from './genre/genre.module';
import { Genre } from './genre/entities/genre.entity';
import { MovieModule } from './movie/movie.module';
import { Movie } from './movie/entities/movie.entity';
import { PosterModule } from './poster/poster.module';
import { Poster } from './poster/entities/poster.entity';
import { TrailerModule } from './trailer/trailer.module';
import { Trailer } from './trailer/entities/trailer.entity';
import { SessionModule } from './session/session.module';
import { Session } from './session/entities/session.entity';
import { TicketModule } from './ticket/ticket.module';
import { Ticket } from './ticket/entities/ticket.entity';
import { SeatModule } from './seat/seat.module';
import { Seat } from './seat/entities/seat.entity';

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
      entities: [
        Review,
        Country,
        Actor,
        Genre,
        Movie,
        Poster,
        Trailer,
        Session,
        Ticket,
        Seat,
      ],
      synchronize: true,
    }),
    ReviewModule,
    CountryModule,
    ActorModule,
    GenreModule,
    MovieModule,
    PosterModule,
    TrailerModule,
    SessionModule,
    TicketModule,
    SeatModule,
  ],
  providers: [Logger],
})
export class AppModule {}
