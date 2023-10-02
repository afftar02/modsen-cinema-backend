import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewModule } from './review/review.module';
import { ConfigModule } from '@nestjs/config';
import { CountryModule } from './country/country.module';
import { ActorModule } from './actor/actor.module';
import { GenreModule } from './genre/genre.module';
import { MovieModule } from './movie/movie.module';
import { PosterModule } from './poster/poster.module';
import { TrailerModule } from './trailer/trailer.module';
import { SessionModule } from './session/session.module';
import { TicketModule } from './ticket/ticket.module';
import { SeatModule } from './seat/seat.module';
import { PersonModule } from './person/person.module';
import { AvatarModule } from './avatar/avatar.module';

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
      autoLoadEntities: true,
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
    PersonModule,
    AvatarModule,
  ],
  providers: [Logger],
})
export class AppModule {}
