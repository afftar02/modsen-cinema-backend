import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private repository: Repository<Country>,
    private readonly logger: Logger,
  ) {}

  create(dto: CreateCountryDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const country = await this.repository.findOne({
      where: { id },
      relations: { movies: true },
    });

    if (!country) {
      const notFoundException = new NotFoundException('Country not found');

      this.logger.error('Unable to find country', notFoundException.stack);

      throw notFoundException;
    }

    return country;
  }

  async update(id: number, dto: UpdateCountryDto) {
    await this.findOne(id);

    return this.repository.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.repository.delete(id);
  }
}
