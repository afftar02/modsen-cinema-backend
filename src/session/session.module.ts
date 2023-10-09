import { Logger, Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { MovieModule } from '../movie/movie.module';

@Module({
  imports: [TypeOrmModule.forFeature([Session]), MovieModule],
  controllers: [SessionController],
  providers: [SessionService, Logger],
  exports: [SessionService],
})
export class SessionModule {}
