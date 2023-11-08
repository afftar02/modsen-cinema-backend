import { Test, TestingModule } from '@nestjs/testing';
import { CountryService } from './country.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';

describe('CountryService', () => {
  let countryService: CountryService;
  let countryRepository: Repository<Country>;
  let logger: Logger;

  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountryService,
        {
          provide: getRepositoryToken(Country),
          useValue: mockRepository,
        },
        Logger,
      ],
    }).compile();

    countryService = module.get<CountryService>(CountryService);
    countryRepository = module.get<Repository<Country>>(
      getRepositoryToken(Country),
    );
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(countryService).toBeDefined();
  });

  describe('create', () => {
    it('should create a country', async () => {
      const createDto: CreateCountryDto = {
        title: 'Test Country',
      };
      const country = new Country();
      country.title = createDto.title;
      jest.spyOn(countryService, 'findByTitle').mockResolvedValue(null);
      jest.spyOn(countryRepository, 'save').mockResolvedValue(country);

      const result = await countryService.create(createDto);

      expect(result).toEqual(country);
    });

    it('should throw BadRequestException if country already exists', async () => {
      const createDto: CreateCountryDto = {
        title: 'Test Country',
      };
      jest
        .spyOn(countryService, 'findByTitle')
        .mockResolvedValue({ id: 1, title: 'Test Country', movies: [] });
      const badRequestSpy = jest.spyOn(logger, 'error');
      const expectedErrorMessage = 'Country is already exists!';

      try {
        await countryService.create(createDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(expectedErrorMessage);
        expect(badRequestSpy).toHaveBeenCalledWith(
          'Unable to create country',
          expect.any(String),
        );
      }
    });
  });

  describe('findByTitle', () => {
    it('should find a country by title', async () => {
      const title = 'Test Country';
      const country = new Country();
      country.title = title;
      jest.spyOn(countryRepository, 'findOne').mockResolvedValue(country);

      const result = await countryService.findByTitle(title);

      expect(result).toEqual(country);
    });

    it('should return null if country is not found', async () => {
      const title = 'Non-Existent Country';
      jest.spyOn(countryRepository, 'findOne').mockResolvedValue(null);

      const result = await countryService.findByTitle(title);

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return an array of countries', async () => {
      const countries = [
        { id: 1, title: 'Country 1', movies: [] },
        { id: 2, title: 'Country 2', movies: [] },
      ];
      jest.spyOn(countryRepository, 'find').mockResolvedValue(countries);

      const result = await countryService.findAll();

      expect(result).toEqual(countries);
    });
  });

  describe('findOne', () => {
    it('should return a country by ID', async () => {
      const id = 1;
      const country = { id, title: 'Test Country', movies: [] };
      jest.spyOn(countryRepository, 'findOne').mockResolvedValue(country);

      const result = await countryService.findOne(id);

      expect(result).toEqual(country);
    });

    it('should throw NotFoundException if country is not found', async () => {
      const id = 999;
      jest.spyOn(countryRepository, 'findOne').mockResolvedValue(null);
      const notFoundSpy = jest.spyOn(logger, 'error');

      try {
        await countryService.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(notFoundSpy).toHaveBeenCalledWith(
          'Unable to find country',
          expect.any(String),
        );
      }
    });
  });

  describe('update', () => {
    it('should update a country', async () => {
      const id = 1;
      const updateDto: UpdateCountryDto = { title: 'Updated Country' };
      const updatedCountry = { id, title: updateDto.title, movies: [] };
      jest.spyOn(countryService, 'findOne').mockResolvedValue(updatedCountry);
      jest.spyOn(countryService, 'findByTitle').mockResolvedValue(null);
      const updateSpy = jest
        .spyOn(countryRepository, 'update')
        .mockResolvedValue({ generatedMaps: [], raw: [], affected: 1 });

      const result = await countryService.update(id, updateDto);

      expect(result).toEqual({ generatedMaps: [], raw: [], affected: 1 });
      expect(updateSpy).toHaveBeenCalledWith(id, updateDto);
    });

    it('should throw BadRequestException if updated title already exists', async () => {
      const id = 1;
      const updateDto: UpdateCountryDto = { title: 'Existing Country' };
      const existingCountry = { id: 2, title: 'Existing Country', movies: [] };
      jest.spyOn(countryService, 'findOne').mockResolvedValue(existingCountry);
      jest
        .spyOn(countryService, 'findByTitle')
        .mockResolvedValue(existingCountry);
      const badRequestSpy = jest.spyOn(logger, 'error');
      const expectedErrorMessage = 'Country is already exists!';

      try {
        await countryService.update(id, updateDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(expectedErrorMessage);
        expect(badRequestSpy).toHaveBeenCalledWith(
          'Unable to update country',
          expect.any(String),
        );
      }
    });
  });

  describe('remove', () => {
    it('should remove a country by ID', async () => {
      const id = 1;
      const country = { id, title: 'Country to be removed', movies: [] };
      jest.spyOn(countryService, 'findOne').mockResolvedValue(country);
      const deleteSpy = jest
        .spyOn(countryRepository, 'delete')
        .mockResolvedValue({ raw: [], affected: 1 });

      const result = await countryService.remove(id);

      expect(result).toEqual({ raw: [], affected: 1 });
      expect(deleteSpy).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if the country to be removed is not found', async () => {
      const id = 999;
      mockRepository.findOne.mockResolvedValue(undefined);
      const notFoundSpy = jest.spyOn(logger, 'error');

      try {
        await countryService.remove(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(notFoundSpy).toHaveBeenCalledWith(
          'Unable to find country',
          expect.any(String),
        );
      }
    });
  });
});
