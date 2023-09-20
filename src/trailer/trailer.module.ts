import { Module } from '@nestjs/common';
import { TrailerService } from './trailer.service';
import { TrailerController } from './trailer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trailer } from './entities/trailer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trailer])],
  controllers: [TrailerController],
  providers: [TrailerService],
  exports: [TrailerService],
})
export class TrailerModule {}
