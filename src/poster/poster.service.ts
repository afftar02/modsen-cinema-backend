import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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
    private readonly logger: Logger,
  ) {}

  create(file: Express.Multer.File) {
    return this.repository.save(file);
  }

  async findOne(id: number) {
    const poster = await this.repository.findOneBy({ id });

    if (!poster) {
      const notFoundException = new NotFoundException('Poster not found');

      this.logger.error('Unable to find poster', notFoundException.stack);

      throw notFoundException;
    }

    return poster;
  }

  async remove(id: number) {
    const poster = await this.repository.findOneBy({ id });

    if (!poster) {
      const notFoundException = new NotFoundException('Poster not found');

      this.logger.error('Unable to find poster', notFoundException.stack);

      throw notFoundException;
    }

    fs.unlink(FILES_PATH + poster.filename, (err) => {
      if (err) {
        throw err;
      }
    });
    return this.repository.delete(id);
  }
}
