import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SeatService } from '../seat/seat.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private repository: Repository<Ticket>,
    @Inject(SeatService)
    private seatService: SeatService,
    private readonly logger: Logger,
  ) {}

  async create(dto: CreateTicketDto) {
    const ticket = this.repository.create(dto);

    ticket.seats = await this.seatService.findByIds(dto.seatIds);

    return this.repository.save(ticket);
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const ticket = await this.repository.findOne({
      where: { id },
      relations: {
        seats: true,
      },
    });

    if (!ticket) {
      const notFoundException = new NotFoundException('Ticket not found');

      this.logger.error('Unable to find ticket', notFoundException.stack);

      throw notFoundException;
    }

    return ticket;
  }

  async update(id: number, dto: UpdateTicketDto) {
    const ticket = await this.repository.findOneBy({ id });

    if (!ticket) {
      const notFoundException = new NotFoundException('Ticket not found');

      this.logger.error('Unable to find ticket', notFoundException.stack);

      throw notFoundException;
    }

    const updateTicket = {
      ...ticket,
      ...this.repository.create(dto),
    };

    if (dto.seatIds) {
      updateTicket.seats = await this.seatService.findByIds(dto.seatIds);
    }

    return this.repository.save(updateTicket);
  }

  async remove(id: number) {
    const ticket = await this.repository.findOne({
      where: { id },
    });

    if (!ticket) {
      const notFoundException = new NotFoundException('Ticket not found');

      this.logger.error('Unable to find ticket', notFoundException.stack);

      throw notFoundException;
    }

    return this.repository.delete(id);
  }
}
