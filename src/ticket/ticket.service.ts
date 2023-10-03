import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SeatService } from '../seat/seat.service';
import { PersonService } from '../person/person.service';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private repository: Repository<Ticket>,
    private seatService: SeatService,
    private personService: PersonService,
    private readonly logger: Logger,
  ) {}

  getInfoFromTicket(ticket: Ticket) {
    const { seats, ...ticketInfo } = ticket;
    const seatsInfo = seats.map((seat) => {
      const { session, ...info } = seat;

      return info;
    });
    const { movie, ...sessionInfo } = seats.at(0).session;

    return {
      ...ticketInfo,
      seats: seatsInfo,
      session: sessionInfo,
      movie: movie,
    };
  }

  async create(personId: number, dto: CreateTicketDto) {
    const ticket = this.repository.create(dto);

    ticket.seats = await this.seatService.findByIds(dto.seatIds);
    ticket.person = await this.personService.findOne(personId);

    return this.repository.save(ticket);
  }

  async findByPersonId(personId: number) {
    await this.personService.findOne(personId);

    const tickets = await this.repository.find({
      where: {
        person: {
          id: personId,
        },
      },
      relations: {
        seats: {
          session: {
            movie: {
              poster: true,
            },
          },
        },
      },
    });

    return tickets.map((ticket) => this.getInfoFromTicket(ticket));
  }

  async findOne(id: number) {
    const ticket = await this.repository.findOne({
      where: { id },
      relations: {
        seats: {
          session: {
            movie: {
              poster: true,
            },
          },
        },
        person: true,
      },
    });

    if (!ticket) {
      const notFoundException = new NotFoundException('Ticket not found');

      this.logger.error('Unable to find ticket', notFoundException.stack);

      throw notFoundException;
    }

    return this.getInfoFromTicket(ticket);
  }

  async update(id: number, dto: UpdateTicketDto) {
    const ticket = await this.findOne(id);

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
    await this.findOne(id);

    return this.repository.delete(id);
  }
}
