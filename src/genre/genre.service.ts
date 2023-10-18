import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private repository: Repository<Genre>,
    private readonly logger: Logger,
  ) {}

  async create(dto: CreateGenreDto) {
    const genre = await this.findByTitle(dto.title);

    if (genre) {
      const badRequestException = new BadRequestException(
        'Genre is already exists!',
      );

      this.logger.error('Unable to create genre', badRequestException.stack);

      throw badRequestException;
    }

    return this.repository.save(dto);
  }

  findByTitle(title: string) {
    return this.repository.findOne({
      where: { title },
    });
  }

  findAll() {
    return this.repository.find();
  }

  findByIds(ids: number[]) {
    return this.repository.findBy({
      id: In(ids),
    });
  }

  async findOne(id: number) {
    const genre = await this.repository.findOne({
      where: { id },
      relations: { movies: true },
    });

    if (!genre) {
      const notFoundException = new NotFoundException('Genre not found');

      this.logger.error('Unable to find genre', notFoundException.stack);

      throw notFoundException;
    }

    return genre;
  }

  async update(id: number, dto: UpdateGenreDto) {
    await this.findOne(id);

    if (dto.title) {
      const genre = await this.findByTitle(dto.title);

      if (genre) {
        const badRequestException = new BadRequestException(
          'Genre is already exists!',
        );

        this.logger.error('Unable to update genre', badRequestException.stack);

        throw badRequestException;
      }
    }

    return this.repository.update(id, dto);
  }

  async remove(id: number) {
    const genre = await this.findOne(id);

    return this.repository.remove(genre);
  }
}
