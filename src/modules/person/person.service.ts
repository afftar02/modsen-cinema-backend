import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePersonDto, UpdatePersonDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities';
import { Repository } from 'typeorm';
import { AvatarService } from '../avatar/avatar.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private repository: Repository<Person>,
    private avatarService: AvatarService,
    private readonly logger: Logger,
  ) {}

  async create(dto: CreatePersonDto) {
    const personWithEmail = await this.findByEmail(dto.email);

    if (personWithEmail) {
      const conflictException = new ConflictException(
        'Person with this email is already exists',
      );

      this.logger.error('Unable to create person', conflictException.stack);

      throw conflictException;
    }

    const person = this.repository.create(dto);

    person.password = await this.getPasswordHash(person.password);

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

  findByEmail(email: string) {
    return this.repository.findOneBy({ email });
  }

  async update(id: number, dto: UpdatePersonDto) {
    const person = await this.findOne(id);

    const updatePerson = {
      ...person,
      ...this.repository.create(dto),
    };

    if (dto.password) {
      updatePerson.password = await this.getPasswordHash(dto.password);
    }

    return this.repository.save(updatePerson);
  }

  async remove(id: number) {
    const person = await this.findOne(id);

    if (person.avatar) {
      await this.avatarService.remove(person.id, person.avatar.id);
    }

    return this.repository.delete(id);
  }

  async getPasswordHash(value: string) {
    const salt = await bcrypt.genSalt(10);

    return await bcrypt.hash(value, salt);
  }
}
