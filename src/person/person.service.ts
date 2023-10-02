import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private repository: Repository<Person>,
    private readonly logger: Logger,
  ) {}

  create(dto: CreatePersonDto) {
    const person = this.repository.create(dto);

    return this.repository.save(person);
  }

  async findOne(id: number) {
    const person = await this.repository.findOne({
      where: { id },
    });

    if (!person) {
      const notFoundException = new NotFoundException('Person not found');

      this.logger.error('Unable to find person', notFoundException.stack);

      throw notFoundException;
    }

    return person;
  }

  async update(id: number, dto: UpdatePersonDto) {
    await this.findOne(id);

    return this.repository.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.repository.delete(id);
  }
}
