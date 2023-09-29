import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
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
  ) {}

  async create(dto: CreateSessionDto) {
    const session = this.repository.create(dto);

    if (session.start >= session.end) {
      throw new BadRequestException(
        'Session start should be earlier than session end!',
      );
    }

    session.movie = await this.movieService.findOne(dto.movieId);

    return this.repository.save(session);
  }

  async findMovieSessions(movieId: number, date: Date) {
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
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async update(id: number, dto: UpdateSessionDto) {
    const session = await this.repository.findOneBy({ id });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    const updateSession = this.repository.create(dto);

    if (
      (dto.start && dto.end && updateSession.start >= updateSession.end) ||
      (dto.start && !dto.end && updateSession.start >= session.end) ||
      (dto.end && !dto.start && session.start >= updateSession.end)
    ) {
      throw new BadRequestException(
        'Session start should be earlier than session end!',
      );
    }

    if (dto.movieId) {
      updateSession.movie = await this.movieService.findOne(dto.movieId);
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
      throw new NotFoundException('Session not found');
    }

    if (session.seats.find((seat) => seat.ticket !== null)) {
      throw new ConflictException('Seat with ticket cannot be deleted!');
    }

    return this.repository.delete(id);
  }
}
