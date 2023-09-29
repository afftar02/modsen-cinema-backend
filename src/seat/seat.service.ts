import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { In, Repository } from 'typeorm';
import { SessionService } from '../session/session.service';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private repository: Repository<Seat>,
    @Inject(SessionService)
    private sessionService: SessionService,
    private readonly logger: Logger,
  ) {}

  async checkExistingSeat(
    sessionId: number,
    dto: CreateSeatDto | UpdateSeatDto,
  ) {
    const sessionSeats = await this.findSessionSeats(sessionId);

    sessionSeats.forEach((seat) => {
      if (dto.number === seat.number && dto.row === seat.row) {
        const badRequestException = new BadRequestException(
          'Seat with this number and row is already exists in current session!',
        );

        this.logger.error(
          'Seat is already exists in current session',
          badRequestException.stack,
        );

        throw badRequestException;
      }
    });
  }

  async create(sessionId: number, dto: CreateSeatDto) {
    await this.checkExistingSeat(sessionId, dto);

    const seat = this.repository.create(dto);

    seat.session = await this.sessionService.findOne(sessionId);

    return this.repository.save(seat);
  }

  async findSessionSeats(sessionId: number) {
    await this.sessionService.findOne(sessionId);

    return this.repository.find({
      where: {
        session: {
          id: sessionId,
        },
      },
      relations: {
        ticket: true,
      },
      select: {
        ticket: {
          id: true,
        },
      },
    });
  }

  findByIds(ids: number[]) {
    return this.repository.findBy({
      id: In(ids),
    });
  }

  async update(id: number, dto: UpdateSeatDto) {
    const seat = await this.repository.findOne({
      where: { id },
      relations: {
        session: true,
      },
    });

    if (!seat) {
      const notFoundException = new NotFoundException('Seat not found');

      this.logger.error('Unable to find seat', notFoundException.stack);

      throw notFoundException;
    }

    await this.checkExistingSeat(seat.session.id, dto);

    return this.repository.update(id, dto);
  }

  async remove(id: number) {
    const seat = await this.repository.findOne({
      where: { id },
      relations: {
        ticket: true,
      },
    });

    if (!seat) {
      const notFoundException = new NotFoundException('Seat not found');

      this.logger.error('Unable to find seat', notFoundException.stack);

      throw notFoundException;
    }

    if (seat.ticket) {
      const conflictException = new ConflictException(
        'Seat with ticket cannot be deleted!',
      );

      this.logger.error(
        'Unable to delete seat with not-null ticket',
        conflictException.stack,
      );

      throw conflictException;
    }

    return this.repository.delete(id);
  }
}
