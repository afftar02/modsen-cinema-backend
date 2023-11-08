import { Test, TestingModule } from '@nestjs/testing';
import { CountryController } from './country.controller';
import { CountryService } from './country.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Logger, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';

describe('CountryController', () => {
  let countryController: CountryController;
  let countryService: CountryService;

  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountryController],
      providers: [
        CountryService,
        {
          provide: getRepositoryToken(Country),
          useValue: mockRepository,
        },
        Logger,
      ],
    }).compile();

    countryController = module.get<CountryController>(CountryController);
    countryService = module.get<CountryService>(CountryService);
  });

  it('should be defined', () => {
    expect(countryController).toBeDefined();
  });

  describe('create', () => {
    it('should create a country', async () => {
      const createDto: CreateCountryDto = { title: 'Test Country' };
      const country = { id: 1, title: createDto.title, movies: [] };
      jest.spyOn(countryService, 'create').mockResolvedValue(country);

      const result = await countryController.create(createDto);

      expect(result).toBe(country);
    });
  });

  describe('findAll', () => {
    it('should return an array of countries', async () => {
      const countries = [
        { id: 1, title: 'Country 1', movies: [] },
        { id: 2, title: 'Country 2', movies: [] },
      ];
      jest.spyOn(countryService, 'findAll').mockResolvedValue(countries);

      const result = await countryController.findAll();

      expect(result).toEqual(countries);
    });
  });

  describe('findOne', () => {
    it('should return a country by ID', async () => {
      const id = '1';
      const country = { id: 1, title: 'Test Country', movies: [] };
      jest.spyOn(countryService, 'findOne').mockResolvedValue(country);

      const result = await countryController.findOne(id);

      expect(result).toBe(country);
    });

    it('should throw NotFoundException if the country is not found', async () => {
      const id = '999';

      mockRepository.findOne.mockResolvedValue(undefined);

      try {
        await countryController.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Country not found');
      }
    });
  });

  describe('update', () => {
    it('should update a country', async () => {
      const id = '1';
      const updateDto: UpdateCountryDto = { title: 'Updated Country' };
      const updateResult = { generatedMaps: [], raw: [], affected: 1 };
      jest.spyOn(countryService, 'update').mockResolvedValue(updateResult);

      const result = await countryController.update(id, updateDto);

      expect(result).toBe(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove a country by ID', async () => {
      const id = '1';
      const deleteResult = { raw: [], affected: 1 };
      jest.spyOn(countryService, 'remove').mockResolvedValue(deleteResult);

      const result = await countryController.remove(id);

      expect(result).toBe(deleteResult);
    });
  });
});
