import { Injectable, NotFoundException } from '@nestjs/common';
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
  ) {}

  create(dto: CreateCountryDto) {
    return this.repository.save(dto);
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const country = await this.repository.findOneBy({ id });

    if (!country) {
      throw new NotFoundException('Country not found');
    }

    return country;
  }

  async update(id: number, dto: UpdateCountryDto) {
    const country = await this.repository.findOneBy({ id });

    if (!country) {
      throw new NotFoundException('Country not found');
    }

    return this.repository.update(id, dto);
  }

  async remove(id: number) {
    const country = await this.repository.findOneBy({ id });

    if (!country) {
      throw new NotFoundException('Country not found');
    }

    return this.repository.delete(id);
  }
}
