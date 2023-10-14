import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { FILES_PATH } from '../constants';
import { Preview } from './entities/preview.entity';

@Injectable()
export class PreviewService {
  constructor(
    @InjectRepository(Preview)
    private repository: Repository<Preview>,
    private readonly logger: Logger,
  ) {}

  create(file: Express.Multer.File) {
    const preview = this.repository.create(file);

    return this.repository.save(preview);
  }

  async findOne(id: number) {
    const preview = await this.repository.findOneBy({ id });

    if (!preview) {
      const notFoundException = new NotFoundException('Preview not found');

      this.logger.error('Unable to find preview', notFoundException.stack);

      throw notFoundException;
    }

    return preview;
  }

  async remove(id: number) {
    const preview = await this.findOne(id);

    fs.unlink(FILES_PATH + preview.filename, (err) => {
      if (err) {
        throw err;
      }
    });
    return this.repository.delete(id);
  }
}
