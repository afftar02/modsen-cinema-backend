import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entities/genre.entity';

describe('GenreService', () => {
  let genreService: GenreService;
  let genreRepository: Repository<Genre>;
  let logger: Logger;

  const mockRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findBy: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockLogger = {
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenreService,
        {
          provide: getRepositoryToken(Genre),
          useValue: mockRepository,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    genreService = module.get<GenreService>(GenreService);
    genreRepository = module.get<Repository<Genre>>(getRepositoryToken(Genre));
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(genreService).toBeDefined();
  });

  describe('create', () => {
    it('should create a genre', async () => {
      const createDto: CreateGenreDto = { title: 'Test Genre' };
      const genre = new Genre();
      genre.title = createDto.title;
      jest.spyOn(genreService, 'findByTitle').mockResolvedValue(null);
      jest.spyOn(genreRepository, 'save').mockResolvedValue(genre);

      const result = await genreService.create(createDto);

      expect(result).toEqual(genre);
    });

    it('should throw BadRequestException if genre already exists', async () => {
      const createDto: CreateGenreDto = { title: 'Existing Genre' };
      jest
        .spyOn(genreService, 'findByTitle')
        .mockResolvedValue({ id: 1, title: createDto.title, movies: [] });
      const badRequestSpy = jest.spyOn(logger, 'error');
      const expectedErrorMessage = 'Genre is already exists!';

      try {
        await genreService.create(createDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(expectedErrorMessage);
        expect(badRequestSpy).toHaveBeenCalledWith(
          'Unable to create genre',
          expect.any(String),
        );
      }
    });
  });

  describe('findByTitle', () => {
    it('should find a genre by title', async () => {
      const title = 'Test Genre';
      const genre = new Genre();
      genre.title = title;
      jest.spyOn(genreRepository, 'findOne').mockResolvedValue(genre);

      const result = await genreService.findByTitle(title);

      expect(result).toEqual(genre);
    });

    it('should return null if genre is not found', async () => {
      const title = 'Non-Existent Genre';
      jest.spyOn(genreRepository, 'findOne').mockResolvedValue(null);

      const result = await genreService.findByTitle(title);

      expect(result).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should return an array of genres', async () => {
      const genres = [
        { id: 1, title: 'Genre 1', movies: [] },
        { id: 2, title: 'Genre 2', movies: [] },
      ];
      jest.spyOn(genreRepository, 'find').mockResolvedValue(genres);

      const result = await genreService.findAll();

      expect(result).toEqual(genres);
    });
  });

  describe('findByIds', () => {
    it('should return an array of genres by their IDs', async () => {
      const genreIds = [1, 2];
      const genres = [
        { id: 1, title: 'Genre 1', movies: [] },
        { id: 2, title: 'Genre 2', movies: [] },
      ];
      mockRepository.findBy.mockResolvedValue(genres);

      const result = await genreService.findByIds(genreIds);

      expect(result).toEqual(genres);
    });
  });

  describe('findOne', () => {
    it('should return a genre by ID', async () => {
      const id = 1;
      const genre = { id, title: 'Test Genre', movies: [] };
      jest.spyOn(genreRepository, 'findOne').mockResolvedValue(genre);

      const result = await genreService.findOne(id);

      expect(result).toEqual(genre);
    });

    it('should throw NotFoundException if genre is not found', async () => {
      const id = 999;
      jest.spyOn(genreRepository, 'findOne').mockResolvedValue(null);
      const notFoundSpy = jest.spyOn(logger, 'error');

      try {
        await genreService.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(notFoundSpy).toHaveBeenCalledWith(
          'Unable to find genre',
          expect.any(String),
        );
      }
    });
  });

  describe('update', () => {
    it('should update a genre', async () => {
      const id = 1;
      const updateDto: UpdateGenreDto = { title: 'Updated Genre' };
      const updatedGenre = { id, title: updateDto.title, movies: [] };
      jest.spyOn(genreService, 'findOne').mockResolvedValue(updatedGenre);
      jest.spyOn(genreService, 'findByTitle').mockResolvedValue(null);
      const updateResult = { generatedMaps: [], raw: [], affected: 1 };
      const updateSpy = jest
        .spyOn(genreRepository, 'update')
        .mockResolvedValue(updateResult);

      const result = await genreService.update(id, updateDto);

      expect(result).toEqual(updateResult);
      expect(updateSpy).toHaveBeenCalledWith(id, updateDto);
    });

    it('should throw BadRequestException if updated title already exists', async () => {
      const id = 1;
      const updateDto: UpdateGenreDto = { title: 'Existing Genre' };
      const existingGenre = { id: 2, title: 'Existing Genre', movies: [] };
      jest.spyOn(genreService, 'findOne').mockResolvedValue(existingGenre);
      jest.spyOn(genreService, 'findByTitle').mockResolvedValue(existingGenre);
      const badRequestSpy = jest.spyOn(logger, 'error');
      const expectedErrorMessage = 'Genre is already exists!';

      try {
        await genreService.update(id, updateDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(expectedErrorMessage);
        expect(badRequestSpy).toHaveBeenCalledWith(
          'Unable to update genre',
          expect.any(String),
        );
      }
    });
  });

  describe('remove', () => {
    it('should remove a genre by ID', async () => {
      const id = 1;
      const genre = { id, title: 'Genre to be removed', movies: [] };
      jest.spyOn(genreService, 'findOne').mockResolvedValue(genre);
      const removeSpy = jest
        .spyOn(genreRepository, 'remove')
        .mockResolvedValue(genre);

      const result = await genreService.remove(id);

      expect(result).toEqual(genre);
      expect(removeSpy).toHaveBeenCalledWith(genre);
    });

    it('should throw NotFoundException if the genre to be removed is not found', async () => {
      const id = 999;
      jest.spyOn(genreService, 'findOne').mockResolvedValue(null);
      const notFoundSpy = jest.spyOn(logger, 'error');

      try {
        await genreService.remove(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(notFoundSpy).toHaveBeenCalledWith(
          'Unable to find genre',
          expect.any(String),
        );
      }
    });
  });
});
