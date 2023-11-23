import { Logger, Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { AvatarController } from './avatar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Avatar])],
  controllers: [AvatarController],
  providers: [AvatarService, Logger],
  exports: [AvatarService],
})
export class AvatarModule {}
