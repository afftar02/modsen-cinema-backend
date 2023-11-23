import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCountryDto, UpdateCountryDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private repository: Repository<Country>,
    private readonly logger: Logger,
  ) {}

  async create(dto: CreateCountryDto) {
    const country = await this.findByTitle(dto.title);

    if (country) {
      const badRequestException = new BadRequestException(
        'Country is already exists!',
      );

      this.logger.error('Unable to create country', badRequestException.stack);

      throw badRequestException;
    }

    return this.repository.save(dto);
  }

  findByTitle(title: string) {
    return this.repository.findOne({
      where: { title },
    });
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const country = await this.repository.findOne({
      where: { id },
      relations: { movies: true },
      select: {
        movies: {
          id: true,
        },
      },
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

    if (dto.title) {
      const country = await this.findByTitle(dto.title);

      if (country) {
        const badRequestException = new BadRequestException(
          'Country is already exists!',
        );

        this.logger.error(
          'Unable to update country',
          badRequestException.stack,
        );

        throw badRequestException;
      }
    }

    return this.repository.update(id, dto);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.repository.delete(id);
  }
}
