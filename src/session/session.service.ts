import {
  BadRequestException,
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

  findAll() {
    return this.repository.find({
      relations: {
        movie: true,
      },
      select: {
        movie: {
          id: true,
        },
      },
    });
  }

  async findOne(id: number) {
    const session = await this.repository.findOne({
      where: { id },
      relations: {
        movie: true,
      },
      select: {
        movie: {
          id: true,
        },
      },
    });

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

    if (updateSession.start >= updateSession.end) {
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
    const session = await this.repository.findOneBy({ id });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return this.repository.delete(id);
  }
}
