import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Repository } from 'typeorm';
import { Session } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieService } from '../movie/movie.service';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private repository: Repository<Session>,
    @Inject(MovieService)
    private movieService: MovieService,
    private readonly logger: Logger,
  ) {}

  async create(movieId: number, dto: CreateSessionDto) {
    const session = this.repository.create(dto);

    if (session.start >= session.end) {
      const invalidSessionDateException = new BadRequestException(
        'Session start should be earlier than session end!',
      );

      this.logger.error(
        'Invalid session start and end dates',
        invalidSessionDateException.stack,
      );

      throw invalidSessionDateException;
    }

    session.movie = await this.movieService.findOne(movieId);

    return this.repository.save(session);
  }

  async findMovieSessions(movieId: number, date: Date) {
    await this.movieService.findOne(movieId);

    let sessions = await this.repository
      .createQueryBuilder('session')
      .where('session.movieId = :movieId', { movieId: movieId })
      .loadRelationCountAndMap(
        'session.availableSeats',
        'session.seats',
        'seat',
        (qb) => qb.where('seat.ticketId IS NULL'),
      )
      .getMany();

    if (date.getDate()) {
      sessions = sessions.filter(
        (session) =>
          session.start.getFullYear() === date.getFullYear() &&
          session.start.getMonth() === date.getMonth() &&
          session.start.getDate() === date.getDate(),
      );
    }

    return sessions;
  }

  async findOne(id: number) {
    const session = await this.repository.findOneBy({ id });

    if (!session) {
      const notFoundException = new NotFoundException('Session not found');

      this.logger.error('Unable to find session', notFoundException.stack);

      throw notFoundException;
    }

    return session;
  }

  async update(id: number, dto: UpdateSessionDto) {
    const session = await this.findOne(id);
    const updateSession = this.repository.create(dto);

    if (
      (dto.start && dto.end && updateSession.start >= updateSession.end) ||
      (dto.start && !dto.end && updateSession.start >= session.end) ||
      (dto.end && !dto.start && session.start >= updateSession.end)
    ) {
      const invalidSessionDateException = new BadRequestException(
        'Session start should be earlier than session end!',
      );

      this.logger.error(
        'Invalid session start and end dates',
        invalidSessionDateException.stack,
      );

      throw invalidSessionDateException;
    }

    return this.repository.update(id, updateSession);
  }

  async remove(id: number) {
    const session = await this.repository.findOne({
      where: { id },
      relations: {
        seats: {
          ticket: true,
        },
      },
    });

    if (!session) {
      const notFoundException = new NotFoundException('Session not found');

      this.logger.error('Unable to find session', notFoundException.stack);

      throw notFoundException;
    }

    if (session.seats.find((seat) => seat.ticket !== null)) {
      const conflictException = new ConflictException(
        'Session with seats with ticket cannot be deleted!',
      );

      this.logger.error(
        'Unable to delete session with seats with not-null ticket',
        conflictException.stack,
      );

      throw conflictException;
    }

    return this.repository.delete(id);
  }
}
