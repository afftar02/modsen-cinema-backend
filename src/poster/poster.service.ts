import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poster } from './entities/poster.entity';
import * as fs from 'fs';
import { FILES_PATH } from '../constants';

@Injectable()
export class PosterService {
  constructor(
    @InjectRepository(Poster)
    private repository: Repository<Poster>,
  ) {}

  create(file: Express.Multer.File) {
    return this.repository.save(file);
  }

  async findOne(id: number) {
    const poster = await this.repository.findOneBy({ id });

    if (!poster) {
      throw new NotFoundException('Poster not found');
    }

    return poster;
  }

  async remove(id: number) {
    const poster = await this.repository.findOneBy({ id });

    if (!poster) {
      throw new NotFoundException('Poster not found');
    }

    fs.unlink(FILES_PATH + poster.filename, (err) => {
      if (err) {
        throw err;
      }
    });
    return this.repository.delete(id);
  }
}
