import { Test, TestingModule } from '@nestjs/testing';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Logger, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { Repository } from 'typeorm';

describe('GenreController', () => {
  let genreController: GenreController;
  let genreService: GenreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [
        GenreService,
        {
          provide: getRepositoryToken(Genre),
          useClass: Repository,
        },
        Logger,
      ],
    }).compile();

    genreController = module.get<GenreController>(GenreController);
    genreService = module.get<GenreService>(GenreService);
  });

  it('should be defined', () => {
    expect(genreController).toBeDefined();
  });

  describe('create', () => {
    it('should create a genre', async () => {
      const createDto: CreateGenreDto = { title: 'Test Genre' };
      const genre = { id: 1, title: createDto.title, movies: [] };
      jest.spyOn(genreService, 'create').mockResolvedValue(genre);

      const result = await genreController.create(createDto);

      expect(result).toBe(genre);
    });
  });

  describe('findAll', () => {
    it('should return an array of genres', async () => {
      const genres = [
        { id: 1, title: 'Genre 1', movies: [] },
        { id: 2, title: 'Genre 2', movies: [] },
      ];
      jest.spyOn(genreService, 'findAll').mockResolvedValue(genres);

      const result = await genreController.findAll();

      expect(result).toEqual(genres);
    });
  });

  describe('findOne', () => {
    it('should return a genre by ID', async () => {
      const id = '1';
      const genre = { id: 1, title: 'Test Genre', movies: [] };
      jest.spyOn(genreService, 'findOne').mockResolvedValue(genre);

      const result = await genreController.findOne(id);

      expect(result).toBe(genre);
    });

    it('should throw NotFoundException if the genre is not found', async () => {
      const id = '999';
      jest.spyOn(genreService, 'findOne').mockResolvedValue(null);

      try {
        await genreController.findOne(id);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Genre not found');
      }
    });
  });

  describe('update', () => {
    it('should update a genre', async () => {
      const id = '1';
      const updateDto: UpdateGenreDto = { title: 'Updated Genre' };
      const updateResult = { generatedMaps: [], raw: [], affected: 1 };
      jest.spyOn(genreService, 'update').mockResolvedValue(updateResult);

      const result = await genreController.update(id, updateDto);

      expect(result).toBe(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove a genre by ID', async () => {
      const id = '1';
      const genre = { id: 1, title: 'Genre to be removed', movies: [] };
      jest.spyOn(genreService, 'remove').mockResolvedValue(genre);

      const result = await genreController.remove(id);

      expect(result).toBe(genre);
    });
  });
});
