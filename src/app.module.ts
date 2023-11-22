import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewModule } from './review/review.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { PreviewModule } from './preview/preview.module';
import typeorm from './shared/common/config/typeorm';
import envSchema from './shared/common/config/envSchema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
      validationSchema: envSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
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
    AuthModule,
    TokenModule,
    PreviewModule,
  ],
  providers: [Logger],
})
export class AppModule {}
