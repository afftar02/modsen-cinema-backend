import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { FILES_PATH } from '../constants';
import { Trailer } from './entities/trailer.entity';

@Injectable()
export class TrailerService {
  constructor(
    @InjectRepository(Trailer)
    private repository: Repository<Trailer>,
  ) {}

  create(file: Express.Multer.File) {
    return this.repository.save(file);
  }

  async findOne(id: number) {
    const trailer = await this.repository.findOneBy({ id });

    if (!trailer) {
      throw new NotFoundException('Trailer not found');
    }

    return trailer;
  }

  async remove(id: number) {
    const trailer = await this.repository.findOneBy({ id });

    if (!trailer) {
      throw new NotFoundException('Trailer not found');
    }

    fs.unlink(FILES_PATH + trailer.filename, (err) => {
      if (err) {
        throw err;
      }
    });
    return this.repository.delete(id);
  }
}
