import { Logger, Module } from '@nestjs/common';
import { SeatService } from './seat.service';
import { SeatController } from './seat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [TypeOrmModule.forFeature([Seat]), SessionModule],
  controllers: [SeatController],
  providers: [SeatService, Logger],
  exports: [SeatService],
})
export class SeatModule {}
