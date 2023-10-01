import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  create(dto: CreateGenreDto) {
    return this.repository.save(dto);
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

    return this.repository.update(id, dto);
  }

  async remove(id: number) {
    const genre = await this.findOne(id);

    return this.repository.remove(genre);
  }
}
