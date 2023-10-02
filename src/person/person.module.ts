import { Logger, Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { AvatarModule } from '../avatar/avatar.module';

@Module({
  imports: [TypeOrmModule.forFeature([Person]), AvatarModule],
  controllers: [PersonController],
  providers: [PersonService, Logger],
  exports: [PersonService],
})
export class PersonModule {}
