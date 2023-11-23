import { Logger, Module } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actor } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Actor])],
  controllers: [ActorController],
  providers: [ActorService, Logger],
  exports: [ActorService],
})
export class ActorModule {}
