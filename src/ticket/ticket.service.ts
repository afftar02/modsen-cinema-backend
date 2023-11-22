import {
  BadRequestException,
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
import { FindMovieDto } from '../movie/dto/find-movie.dto';
import { LANGUAGES } from '../shared/common/constants';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket)
    private repository: Repository<Ticket>,
    private seatService: SeatService,
    private readonly logger: Logger,
  ) {}

  getInfoFromTicket(ticket: Ticket, language: string) {
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
      movie: new FindMovieDto(movie, language),
    };
  }

  async markMissed(ticket: Ticket) {
    if (!ticket.isMissed) {
      const currentDate = new Date();
      const ticketIsNotPaidForStartedSession =
        currentDate >= ticket.seats.at(0).session.start && !ticket.isPaid;
      const paidSessionIsNotVisitedByPerson =
        currentDate >= ticket.seats.at(0).session.end &&
        ticket.isPaid &&
        !ticket.isVisited;

      if (ticketIsNotPaidForStartedSession || paidSessionIsNotVisitedByPerson) {
        await this.repository.update(ticket.id, { isMissed: true });
        ticket.isMissed = true;
      }
    }
  }

  checkFoundSeats(ticket: Ticket, dto: CreateTicketDto | UpdateTicketDto) {
    if (ticket.seats.length !== dto.seatIds.length) {
      const badRequestException = new BadRequestException(
        'Ticket seats are not found',
      );

      this.logger.error(
        'Unable to find ticket seats',
        badRequestException.stack,
      );

      throw badRequestException;
    }
  }

  async checkForSessionEnd(ticket: Ticket) {
    const { session } = await this.seatService.findById(ticket.seats.at(0).id);
    const currentDate = new Date();

    if (currentDate >= session.end) {
      const badRequestException = new BadRequestException('Session is ended');

      this.logger.error(
        'Session for current ticket is ended',
        badRequestException.stack,
      );

      throw badRequestException;
    }
  }

  async checkForBookedSeats(seatIds: number[]) {
    for (const seatId of seatIds) {
      const { ticket } = await this.seatService.findById(seatId);

      if (ticket) {
        const badRequestException = new BadRequestException(
          'Seat is already booked',
        );

        this.logger.error('Seat is booked', badRequestException.stack);

        throw badRequestException;
      }
    }
  }

  async checkForSameSession(seatIds: number[]) {
    const { session: commonSession } = await this.seatService.findById(
      seatIds.at(0),
    );

    for (const seatId of seatIds) {
      const { session } = await this.seatService.findById(seatId);

      if (session.id !== commonSession.id) {
        const badRequestException = new BadRequestException(
          'Ticket should have seats from the same session',
        );

        this.logger.error(
          'Unable to create ticket with seats from different sessions',
          badRequestException.stack,
        );

        throw badRequestException;
      }
    }
  }

  async calculateDiscount(ticket: Ticket) {
    const { session } = await this.seatService.findById(ticket.seats.at(0).id);
    const currentDate = new Date();

    if (
      currentDate < session.start &&
      session.start.getDate() - currentDate.getDate() <= 7
    ) {
      return 5 * (session.start.getDate() - currentDate.getDate());
    } else {
      return 0;
    }
  }

  async create(personId: number, dto: CreateTicketDto) {
    const ticket = this.repository.create(dto);

    ticket.seats = await this.seatService.findByIds(dto.seatIds);

    this.checkFoundSeats(ticket, dto);
    await this.checkForBookedSeats(dto.seatIds);
    await this.checkForSessionEnd(ticket);
    await this.checkForSameSession(dto.seatIds);

    ticket.discount = await this.calculateDiscount(ticket);

    return this.repository.save({
      ...ticket,
      person: {
        id: personId,
      },
    });
  }

  async findByPersonId(personId: number, language: string) {
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

    for (const ticket of tickets) {
      await this.markMissed(ticket);
    }

    return tickets.map((ticket) => this.getInfoFromTicket(ticket, language));
  }

  async findOne(
    personId: number,
    id: number,
    language: string = LANGUAGES.at(0),
  ) {
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

    await this.markMissed(ticket);

    return this.getInfoFromTicket(ticket, language);
  }

  async update(personId: number, id: number, dto: UpdateTicketDto) {
    const ticket = await this.findOne(personId, id);

    const updateTicket = {
      ...ticket,
      ...this.repository.create(dto),
    };

    if (dto.seatIds) {
      updateTicket.seats = await this.seatService.findByIds(dto.seatIds);

      this.checkFoundSeats(updateTicket, dto);
      await this.checkForBookedSeats(dto.seatIds);
      await this.checkForSessionEnd(updateTicket);
      await this.checkForSameSession(dto.seatIds);

      ticket.discount = await this.calculateDiscount(updateTicket);
    }

    if (dto.isPaid) {
      await this.checkForSessionEnd(updateTicket);
    }

    return this.repository.save(updateTicket);
  }

  async remove(personId: number, id: number) {
    await this.findOne(personId, id);

    return this.repository.delete(id);
  }
}
