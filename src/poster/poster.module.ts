import { Logger, Module } from '@nestjs/common';
import { PosterService } from './poster.service';
import { PosterController } from './poster.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poster } from './entities/poster.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Poster])],
  controllers: [PosterController],
  providers: [PosterService, Logger],
  exports: [PosterService],
})
export class PosterModule {}
