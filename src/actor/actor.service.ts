import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Actor } from './entities/actor.entity';

@Injectable()
export class ActorService {
  constructor(
    @InjectRepository(Actor)
    private repository: Repository<Actor>,
    private readonly logger: Logger,
  ) {}

  async create(dto: CreateActorDto) {
    const actor = await this.findByNameAndSurname(dto.name, dto.surname);

    if (actor) {
      const badRequestException = new BadRequestException(
        'Actor is already exists!',
      );

      this.logger.error('Unable to create actor', badRequestException.stack);

      throw badRequestException;
    }

    return this.repository.save(dto);
  }

  findByNameAndSurname(name: string, surname: string) {
    return this.repository.findOneBy({
      name,
      surname,
    });
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
    const actor = await this.repository.findOne({
      where: { id },
      relations: { movies: true },
    });

    if (!actor) {
      const notFoundException = new NotFoundException('Actor not found');

      this.logger.error('Unable to find actor', notFoundException.stack);

      throw notFoundException;
    }

    return actor;
  }

  async update(id: number, dto: UpdateActorDto) {
    const actorById = await this.findOne(id);

    const existingActor = await this.findByNameAndSurname(
      dto.name ?? actorById.name,
      dto.surname ?? actorById.surname,
    );

    if (existingActor) {
      const badRequestException = new BadRequestException(
        'Actor is already exists!',
      );

      this.logger.error('Unable to create actor', badRequestException.stack);

      throw badRequestException;
    }

    return this.repository.update(id, dto);
  }

  async remove(id: number) {
    const actor = await this.findOne(id);

    return this.repository.remove(actor);
  }
}
