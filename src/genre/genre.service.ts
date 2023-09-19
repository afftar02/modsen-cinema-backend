import { Injectable, NotFoundException } from '@nestjs/common';
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
      throw new NotFoundException('Genre not found');
    }

    return genre;
  }

  async update(id: number, dto: UpdateGenreDto) {
    const genre = await this.repository.findOneBy({ id });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    return this.repository.update(id, dto);
  }

  async remove(id: number) {
    const genre = await this.repository.findOne({
      where: { id },
      relations: { movies: true },
    });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    genre.movies = [];

    await this.repository.save(genre);

    return this.repository.delete(id);
  }
}
