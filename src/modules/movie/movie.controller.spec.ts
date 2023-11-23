import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { CreateMovieDto, UpdateMovieDto } from './dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Movie } from './entities';
import { CountryService } from '../country/country.service';
import { ActorService } from '../actor/actor.service';
import { GenreService } from '../genre/genre.service';
import { PosterService } from '../poster/poster.service';
import { TrailerService } from '../trailer/trailer.service';

describe('MovieController', () => {
  let movieController: MovieController;
  let movieService: MovieService;

  const mockLogger = {
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
        {
          provide: CountryService,
          useValue: {},
        },
        {
          provide: ActorService,
          useValue: {},
        },
        {
          provide: GenreService,
          useValue: {},
        },
        {
          provide: PosterService,
          useValue: {},
        },
        {
          provide: TrailerService,
          useValue: {},
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    movieController = module.get<MovieController>(MovieController);
    movieService = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(movieController).toBeDefined();
  });

  describe('create', () => {
    it('should create a movie', async () => {
      const createDto: CreateMovieDto = {
        title: { en: 'Test Movie', ru: 'Тестовый фильм' },
        description: {
          en: 'Movie description',
          ru: 'Описание к фильму',
        },
        author: 'Author',
        ageRestriction: 18,
        quality: 'HD',
        start: new Date('2024-01-01'),
        countryId: null,
        genreIds: [],
        actorIds: [],
        posterId: null,
        trailerId: null,
      };
      const createdMovie = {
        id: 1,
        title_en: createDto.title.en,
        title_ru: createDto.title.ru,
        description_en: createDto.description.en,
        description_ru: createDto.description.ru,
        rating: null,
        ageRestriction: createDto.ageRestriction,
        quality: createDto.quality,
        start: createDto.start,
        author: createDto.author,
        reviews: [],
        country: null,
        actors: [],
        genres: [],
        poster: null,
        trailer: null,
        sessions: [],
      };
      jest.spyOn(movieService, 'create').mockResolvedValue(createdMovie);

      const result = await movieController.create(createDto);

      expect(result).toBe(createdMovie);
    });
  });

  describe('findAll', () => {
    it('should return an array of localized movies', async () => {
      const language = 'en';
      const localizedMovies = [
        {
          id: 1,
          title: 'Title',
          description: 'Description',
          rating: 5,
          ageRestriction: 18,
          quality: 'HD',
          start: new Date('2024-01-01'),
          author: 'Author',
          reviews: [],
          country: null,
          actors: [],
          genres: [],
          poster: null,
          trailer: null,
          sessions: [],
        },
      ];
      jest
        .spyOn(movieService, 'findAllLocalized')
        .mockResolvedValue(localizedMovies);

      const result = await movieController.findAll(language);

      expect(result).toBe(localizedMovies);
    });

    it('should return bad request if language is incorrect', async () => {
      const language = 'pl';
      const localizedMovies = [
        {
          id: 1,
          title: 'Title',
          description: 'Description',
          rating: 5,
          ageRestriction: 18,
          quality: 'HD',
          start: new Date('2024-01-01'),
          author: 'Author',
          reviews: [],
          country: null,
          actors: [],
          genres: [],
          poster: null,
          trailer: null,
          sessions: [],
        },
      ];
      jest
        .spyOn(movieService, 'findAllLocalized')
        .mockResolvedValue(localizedMovies);

      try {
        await movieController.findAll(language);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('findOne', () => {
    it('should return a localized movie by ID', async () => {
      const id = '1';
      const language = 'ru';
      const localizedMovie = {
        id: 1,
        title: 'Заголовок',
        description: 'Описание',
        rating: 5,
        ageRestriction: 18,
        quality: 'HD',
        start: new Date('2024-01-01'),
        author: 'Author',
        reviews: [],
        country: null,
        actors: [],
        genres: [],
        poster: null,
        trailer: null,
        sessions: [],
      };
      jest
        .spyOn(movieService, 'findOneLocalized')
        .mockResolvedValue(localizedMovie);

      const result = await movieController.findOne(id, language);

      expect(result).toBe(localizedMovie);
    });

    it('bad request if language is incorrect', async () => {
      const id = '1';
      const language = 'de';
      const localizedMovie = {
        id: 1,
        title: 'Заголовок',
        description: 'Описание',
        rating: 5,
        ageRestriction: 18,
        quality: 'HD',
        start: new Date('2024-01-01'),
        author: 'Author',
        reviews: [],
        country: null,
        actors: [],
        genres: [],
        poster: null,
        trailer: null,
        sessions: [],
      };
      jest
        .spyOn(movieService, 'findOneLocalized')
        .mockResolvedValue(localizedMovie);

      try {
        await movieController.findOne(id, language);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const id = '1';
      const updateDto: UpdateMovieDto = {
        title: { en: 'Updated Movie', ru: 'Обновленный фильм' },
      };
      const updatedMovie = {
        id: 1,
        title_en: 'Updated Movie',
        title_ru: 'Обновленный фильм',
        description_en: 'Description',
        description_ru: 'Описание',
        rating: 5,
        ageRestriction: 18,
        quality: 'HD',
        start: new Date('2024-01-01'),
        author: 'Author',
        reviews: [],
        country: null,
        actors: [],
        genres: [],
        poster: null,
        trailer: null,
        sessions: [],
      };
      jest.spyOn(movieService, 'update').mockResolvedValue(updatedMovie);

      const result = await movieController.update(id, updateDto);

      expect(result).toBe(updatedMovie);
    });
  });

  describe('remove', () => {
    it('should remove a movie by ID', async () => {
      const id = '1';
      const deleteResult = { raw: [], affected: 1 };
      jest.spyOn(movieService, 'remove').mockResolvedValue(deleteResult);

      const result = await movieController.remove(id);

      expect(result).toBe(deleteResult);
    });
  });
});
