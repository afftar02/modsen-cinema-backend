import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
    private seatService: SeatService,
    private readonly logger: Logger,
  ) {}

  getInfoFromTicket(ticket: Ticket) {
    const { seats, person, ...ticketInfo } = ticket;
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

    return this.repository.save({
      ...ticket,
      person: {
        id: personId,
      },
    });
  }

  async findByPersonId(personId: number) {
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

  async findOne(personId: number, id: number) {
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

    if (ticket.person.id !== personId) {
      const forbiddenException = new ForbiddenException('No access');

      this.logger.error('No access', forbiddenException.stack);

      throw forbiddenException;
    }

    return this.getInfoFromTicket(ticket);
  }

  async update(personId: number, id: number, dto: UpdateTicketDto) {
    const ticket = await this.findOne(personId, id);

    const updateTicket = {
      ...ticket,
      ...this.repository.create(dto),
    };

    if (dto.seatIds) {
      updateTicket.seats = await this.seatService.findByIds(dto.seatIds);
    }

    return this.repository.save(updateTicket);
  }

  async remove(personId: number, id: number) {
    await this.findOne(personId, id);

    return this.repository.delete(id);
  }
}
