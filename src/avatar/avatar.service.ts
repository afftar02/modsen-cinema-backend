import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Avatar } from './entities/avatar.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import { FILES_PATH } from '../shared/common/constants';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(Avatar)
    private repository: Repository<Avatar>,
    private readonly logger: Logger,
  ) {}

  async create(userId: number, file: Express.Multer.File) {
    if (!file) {
      const badRequestException = new BadRequestException(
        'Uploaded file cannot be empty',
      );

      this.logger.error('Unable to create avatar', badRequestException.stack);

      throw badRequestException;
    }

    const previousAvatar = await this.findByUserId(userId);

    const result = await this.repository.save({
      ...file,
      person: {
        id: userId,
      },
    });

    if (previousAvatar) {
      await this.remove(userId, previousAvatar.id);
    }

    return result;
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

  findByUserId(userId: number) {
    return this.repository.findOne({
      where: {
        person: {
          id: userId,
        },
      },
    });
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

    if (avatar.person && userId !== avatar.person.id) {
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
