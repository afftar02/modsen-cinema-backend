import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { AvatarService } from '../avatar/avatar.service';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private repository: Repository<Person>,
    @Inject(AvatarService)
    private avatarService: AvatarService,
    private readonly logger: Logger,
  ) {}

  async create(dto: CreatePersonDto) {
    const person = this.repository.create(dto);

    if (dto.avatarId) {
      person.avatar = await this.avatarService.findOne(dto.avatarId);
    }

    return this.repository.save(person);
  }

  async findOne(id: number) {
    const person = await this.repository.findOne({
      where: { id },
      relations: {
        avatar: true,
      },
    });

    if (!person) {
      const notFoundException = new NotFoundException('Person not found');

      this.logger.error('Unable to find person', notFoundException.stack);

      throw notFoundException;
    }

    return person;
  }

  async update(id: number, dto: UpdatePersonDto) {
    const person = await this.findOne(id);

    const updatePerson = {
      ...person,
      ...this.repository.create(dto),
    };

    if (dto.avatarId) {
      updatePerson.avatar = await this.avatarService.findOne(dto.avatarId);
    }

    if (dto.avatarId && person.avatar) {
      await this.avatarService.remove(person.avatar.id);
    }

    return this.repository.save(updatePerson);
  }

  async remove(id: number) {
    const person = await this.findOne(id);

    if (person.avatar) {
      await this.avatarService.remove(person.avatar.id);
    }

    return this.repository.delete(id);
  }
}
