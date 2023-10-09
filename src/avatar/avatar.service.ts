import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Avatar } from './entities/avatar.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { FILES_PATH } from '../constants';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(Avatar)
    private repository: Repository<Avatar>,
    private readonly logger: Logger,
  ) {}

  create(file: Express.Multer.File) {
    return this.repository.save(file);
  }

  async findOne(id: number) {
    const avatar = await this.repository.findOneBy({ id });

    if (!avatar) {
      const notFoundException = new NotFoundException('Avatar not found');

      this.logger.error('Unable to find avatar', notFoundException.stack);

      throw notFoundException;
    }

    return avatar;
  }

  async remove(userId: number, id: number) {
    const avatar = await this.repository.findOne({
      where: { id },
      relations: {
        person: true,
      },
    });

    if (!avatar) {
      const notFoundException = new NotFoundException('Avatar not found');

      this.logger.error('Unable to find avatar', notFoundException.stack);

      throw notFoundException;
    }

    if (userId !== avatar.person.id) {
      const forbiddenException = new ForbiddenException('No access');

      this.logger.error('No access', forbiddenException.stack);

      throw forbiddenException;
    }

    fs.unlink(FILES_PATH + avatar.filename, (err) => {
      if (err) {
        throw err;
      }
    });
    return this.repository.delete(id);
  }
}
