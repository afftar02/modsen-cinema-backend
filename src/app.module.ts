import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewModule } from './modules/review/review.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CountryModule } from './modules/country/country.module';
import { ActorModule } from './modules/actor/actor.module';
import { GenreModule } from './modules/genre/genre.module';
import { MovieModule } from './modules/movie/movie.module';
import { PosterModule } from './modules/poster/poster.module';
import { TrailerModule } from './modules/trailer/trailer.module';
import { SessionModule } from './modules/session/session.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { SeatModule } from './modules/seat/seat.module';
import { PersonModule } from './modules/person/person.module';
import { AvatarModule } from './modules/avatar/avatar.module';
import { AuthModule } from './modules/auth/auth.module';
import { TokenModule } from './modules/token/token.module';
import { PreviewModule } from './modules/preview/preview.module';
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
