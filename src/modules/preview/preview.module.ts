import { Logger, Module } from '@nestjs/common';
import { PreviewService } from './preview.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Preview } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Preview])],
  providers: [PreviewService, Logger],
  exports: [PreviewService],
})
export class PreviewModule {}
