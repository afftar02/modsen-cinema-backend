import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { QueryRunner, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Logger, NotFoundException } from '@nestjs/common';
import { CreateMovieDto, UpdateMovieDto } from './dto';
import { Movie } from './entities';
import { CountryService } from '../country/country.service';
import { ActorService } from '../actor/actor.service';
import { GenreService } from '../genre/genre.service';
import { PosterService } from '../poster/poster.service';
import { TrailerService } from '../trailer/trailer.service';
import { Country } from '../country/entities';
import { Actor } from '../actor/entities';
import { Genre } from '../genre/entities';
import { Poster } from '../poster/entities';
import { Trailer } from '../trailer/entities';
import { PreviewService } from '../preview/preview.service';

describe('MovieService', () => {
  let movieService: MovieService;
  let movieRepository: Repository<Movie>;
  let posterService: PosterService;
  let trailerService: TrailerService;

  const qr = {
    manager: {},
  } as QueryRunner;

  qr.manager.save = jest.fn();
  qr.manager.findOne = jest.fn();

  const mockPreviewService = {
    create: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockLogger = {
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
        CountryService,
        {
          provide: getRepositoryToken(Country),
          useClass: Repository,
        },
        ActorService,
        {
          provide: getRepositoryToken(Actor),
          useClass: Repository,
        },
        GenreService,
        {
          provide: getRepositoryToken(Genre),
          useClass: Repository,
        },
        PosterService,
        {
          provide: getRepositoryToken(Poster),
          useClass: Repository,
        },
        TrailerService,
        {
          provide: getRepositoryToken(Trailer),
          useClass: Repository,
        },
        {
          provide: PreviewService,
          useValue: mockPreviewService,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    movieService = module.get<MovieService>(MovieService);
    movieRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    posterService = module.get<PosterService>(PosterService);
    trailerService = module.get<TrailerService>(TrailerService);
  });

  it('should be defined', () => {
    expect(movieService).toBeDefined();
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
      const movie = new Movie();
      movie.title_en = createDto.title.en;
      jest.spyOn(movieService, 'bindRelations').mockResolvedValue();
      jest.spyOn(movieRepository, 'create').mockReturnValue(movie);
      jest.spyOn(movieRepository, 'save').mockResolvedValue(movie);

      const result = await movieService.create(createDto);

      expect(result).toEqual(movie);
    });
  });

  describe('findAllLocalized', () => {
    it('should return an array of FindMovieDto with localization', async () => {
      const language = 'ru';
      const movies = [
        {
          id: 1,
          title_en: 'Title',
          title_ru: 'Заголовок',
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
        },
        new Movie(),
      ];
      jest.spyOn(movieRepository, 'find').mockResolvedValue(movies);

      const result = await movieService.findAllLocalized(language);

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe(movies[0].title_ru);
    });
  });

  describe('findOne', () => {
    it('should return a movie by ID', async () => {
      const id = 1;
      const movie = new Movie();
      jest.spyOn(movieRepository, 'findOne').mockResolvedValue(movie);

      const result = await movieService.findOne(id);

      expect(result).toBe(movie);
    });

    it('should throw NotFoundException if the movie is not found', async () => {
      const id = 999;
      jest.spyOn(movieRepository, 'findOne').mockResolvedValue(null);

      await expect(movieService.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneLocalized', () => {
    it('should return a localized movie by ID', async () => {
      const id = 1;
      const language = 'en';
      const movie = {
        id: 1,
        title_en: 'Title',
        title_ru: 'Заголовок',
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
      jest.spyOn(movieService, 'findOne').mockResolvedValue(movie);

      const result = await movieService.findOneLocalized(id, language);

      expect(result.title).toBe(movie.title_en);
    });
  });

  describe('update', () => {
    it('should update a movie', async () => {
      const id = 1;
      const updateDto: UpdateMovieDto = {
        title: { en: 'Updated Movie', ru: 'Обновленный фильм' },
      };
      const movie = new Movie();
      jest.spyOn(movieService, 'findOne').mockResolvedValue(movie);
      jest.spyOn(movieRepository, 'create').mockReturnValue(movie);
      jest.spyOn(movieService, 'bindRelations').mockResolvedValue();
      jest.spyOn(movieRepository, 'save').mockResolvedValue(movie);

      const result = await movieService.update(id, updateDto);

      expect(result).toBe(movie);
    });
  });

  describe('remove', () => {
    it('should remove a movie by ID', async () => {
      const id = 1;
      const movie = new Movie();
      jest.spyOn(movieService, 'findOne').mockResolvedValue(movie);
      jest.spyOn(posterService, 'remove').mockResolvedValue(null);
      jest.spyOn(trailerService, 'remove').mockResolvedValue(null);
      jest
        .spyOn(movieRepository, 'delete')
        .mockResolvedValue({ raw: [], affected: 1 });

      const result = await movieService.remove(id);

      expect(result.affected).toBe(1);
    });
  });

  describe('updateMovieRating', () => {
    it('should update the rating of a movie', async () => {
      const movieId = 1;
      const movie = new Movie();
      movie.reviews = [
        {
          id: 1,
          rating: 5,
          author: 'Author',
          description: 'Description',
          movie: null,
        },
        {
          id: 2,
          rating: 4,
          author: 'Author',
          description: 'Description',
          movie: null,
        },
      ];
      jest.spyOn(qr.manager, 'findOne').mockResolvedValue(movie);
      jest.spyOn(qr.manager, 'save').mockResolvedValue(movie);

      const result = await movieService.updateMovieRating(movieId, qr);

      expect(result.rating).toBe(4.5);
    });
  });
});
