import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { FILES_PATH } from '../shared/common/constants';
import { Trailer } from './entities/trailer.entity';
import { PreviewService } from '../preview/preview.service';

@Injectable()
export class TrailerService {
  constructor(
    @InjectRepository(Trailer)
    private repository: Repository<Trailer>,
    private previewService: PreviewService,
    private readonly logger: Logger,
  ) {}

  checkForEmptyFiles(
    trailerFile: Express.Multer.File[],
    previewFile: Express.Multer.File[],
  ) {
    if (!trailerFile || !previewFile) {
      const badRequestException = new BadRequestException(
        'Trailer should have both trailer and preview files',
      );

      this.logger.error('Unable to create trailer', badRequestException.stack);

      this.removeLocal(trailerFile, previewFile);

      throw badRequestException;
    }
  }

  async create(
    trailerFile: Express.Multer.File[],
    previewFile: Express.Multer.File[],
  ) {
    this.checkForEmptyFiles(trailerFile, previewFile);

    const trailer = this.repository.create(trailerFile.at(0));

    trailer.preview = await this.previewService.create(previewFile.at(0));

    return this.repository.save(trailer);
  }

  async findOne(id: number) {
    const trailer = await this.repository.findOne({
      where: { id },
      relations: {
        preview: true,
      },
    });

    if (!trailer) {
      const notFoundException = new NotFoundException('Trailer not found');

      this.logger.error('Unable to find trailer', notFoundException.stack);

      throw notFoundException;
    }

    return trailer;
  }

  async remove(id: number) {
    const trailer = await this.findOne(id);

    fs.unlink(FILES_PATH + trailer.filename, (err) => {
      if (err) {
        throw err;
      }
    });
    const deleteResult = await this.repository.delete(id);

    await this.previewService.remove(trailer.preview.id);

    return deleteResult;
  }

  private removeLocal(
    trailer: Express.Multer.File[],
    preview: Express.Multer.File[],
  ) {
    if (trailer) {
      fs.unlink(FILES_PATH + trailer.at(0).filename, (err) => {
        if (err) {
          throw err;
        }
      });
    }
    if (preview) {
      fs.unlink(FILES_PATH + preview.at(0).filename, (err) => {
        if (err) {
          throw err;
        }
      });
    }
  }
}
