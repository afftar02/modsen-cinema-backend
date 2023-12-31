import { Logger, Module } from '@nestjs/common';
import { TrailerService } from './trailer.service';
import { TrailerController } from './trailer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trailer } from './entities';
import { PreviewModule } from '../preview/preview.module';

@Module({
  imports: [TypeOrmModule.forFeature([Trailer]), PreviewModule],
  controllers: [TrailerController],
  providers: [TrailerService, Logger],
  exports: [TrailerService],
})
export class TrailerModule {}
