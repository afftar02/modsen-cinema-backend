import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actor } from './entities/actor.entity';

@Injectable()
export class ActorService {
  constructor(
    @InjectRepository(Actor)
    private repository: Repository<Actor>,
  ) {}

  create(dto: CreateActorDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const actor = await this.repository.findOneBy({ id });

    if (!actor) {
      throw new NotFoundException('Actor not found');
    }

    return actor;
  }

  async update(id: number, dto: UpdateActorDto) {
    const actor = await this.repository.findOneBy({ id });

    if (!actor) {
      throw new NotFoundException('Actor not found');
    }

    return this.repository.update(id, dto);
  }

  async remove(id: number) {
    const actor = await this.repository.findOneBy({ id });

    if (!actor) {
      throw new NotFoundException('Actor not found');
    }

    return this.repository.delete(id);
  }
}
