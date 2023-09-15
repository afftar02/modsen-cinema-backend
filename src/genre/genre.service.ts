import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findOne(id: number) {
    const genre = await this.repository.findOneBy({ id });

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
    const genre = await this.repository.findOneBy({ id });

    if (!genre) {
      throw new NotFoundException('Genre not found');
    }

    return this.repository.delete(id);
  }
}
