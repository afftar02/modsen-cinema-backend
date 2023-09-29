import { Logger, Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketController } from './ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { SeatModule } from '../seat/seat.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), SeatModule],
  controllers: [TicketController],
  providers: [TicketService, Logger],
})
export class TicketModule {}
