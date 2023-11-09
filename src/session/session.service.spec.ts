import { Test, TestingModule } from '@nestjs/testing';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { MovieService } from '../movie/movie.service';
import { Session } from './entities/session.entity';
import { Movie } from '../movie/entities/movie.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Seat } from '../seat/entities/seat.entity';

describe('SessionService', () => {
  let sessionService: SessionService;
  let movieService: MovieService;

  const mockSessionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn(),
    delete: jest.fn(),
  };
  const mockMovieService = {
    findOne: jest.fn(),
  };
  const mockLogger = {
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: getRepositoryToken(Session),
          useValue: mockSessionRepository,
        },
        {
          provide: MovieService,
          useValue: mockMovieService,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    sessionService = module.get<SessionService>(SessionService);
    movieService = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(sessionService).toBeDefined();
  });

  describe('validateWithMovieStart', () => {
    it('should not throw an error if session start is equal to movie start', () => {
      const movie = new Movie();
      const session = new Session();

      movie.start = new Date('2023-11-01T10:00:00Z');
      session.start = new Date('2023-11-01T10:00:00Z');

      expect(() =>
        sessionService.validateWithMovieStart(movie, session),
      ).not.toThrowError();
    });

    it('should not throw an error if session start is after movie start', () => {
      const movie = new Movie();
      const session = new Session();

      movie.start = new Date('2023-11-01T10:00:00Z');
      session.start = new Date('2023-11-01T11:00:00Z');

      expect(() =>
        sessionService.validateWithMovieStart(movie, session),
      ).not.toThrowError();
    });

    it('should throw a BadRequestException if session start is before movie start', () => {
      const movie = new Movie();
      const session = new Session();

      movie.start = new Date('2023-11-01T10:00:00Z');
      session.start = new Date('2023-11-01T09:00:00Z');

      expect(() =>
        sessionService.validateWithMovieStart(movie, session),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('create', () => {
    it('should create a new session', async () => {
      const createSessionDto: CreateSessionDto = {
        start: new Date('2023-11-01T10:00:00Z'),
        end: new Date('2023-11-01T12:00:00Z'),
        format: '2D',
      };
      const movieId = 1;
      const movie = new Movie();
      const session: Session = {
        id: 1,
        start: new Date('2023-11-01T10:00:00Z'),
        end: new Date('2023-11-01T12:00:00Z'),
        format: '2D',
        movie,
        seats: [],
      };

      jest.spyOn(sessionService, 'validateWithMovieStart');
      jest.spyOn(movieService, 'findOne').mockResolvedValue(movie);
      mockSessionRepository.create.mockReturnValue(session);
      mockSessionRepository.save.mockResolvedValue(session);

      const result = await sessionService.create(movieId, createSessionDto);

      expect(result).toEqual(session);
    });

    it('should throw bad request if session start equal or after session end', async () => {
      const createSessionDto: CreateSessionDto = {
        start: new Date('2023-11-01T10:00:00Z'),
        end: new Date('2023-11-01T10:00:00Z'),
        format: '2D',
      };
      const movieId = 1;
      const movie = new Movie();
      const session: Session = {
        id: 1,
        start: new Date('2023-11-01T10:00:00Z'),
        end: new Date('2023-11-01T10:00:00Z'),
        format: '2D',
        movie,
        seats: [],
      };

      jest.spyOn(sessionService, 'validateWithMovieStart');
      jest.spyOn(movieService, 'findOne').mockResolvedValue(movie);
      mockSessionRepository.create.mockReturnValue(session);
      mockSessionRepository.save.mockResolvedValue(session);

      try {
        await sessionService.create(movieId, createSessionDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });

  describe('findMovieSessions', () => {
    it('should find sessions for a movie and date', async () => {
      const movieId = 1;
      const date = new Date('2023-11-01');
      const sessions = [
        {
          id: 1,
          start: new Date('2023-11-01T10:00:00Z'),
          end: new Date('2023-11-01T12:00:00Z'),
          format: '2D',
          movie: null,
          seats: [],
        },
        {
          id: 2,
          start: new Date('2023-12-01T10:00:00Z'),
          end: new Date('2023-12-01T12:00:00Z'),
          format: '2D',
          movie: null,
          seats: [],
        },
      ];

      jest.spyOn(movieService, 'findOne').mockResolvedValue(new Movie());
      jest
        .spyOn(mockSessionRepository, 'createQueryBuilder')
        .mockReturnValueOnce({
          where: jest.fn().mockReturnThis(),
          loadRelationCountAndMap: jest.fn().mockReturnThis(),
          getMany: jest.fn().mockResolvedValue(sessions),
        });

      const result = await sessionService.findMovieSessions(movieId, date);

      expect(result.length).toEqual(1);
    });
  });

  describe('findOne', () => {
    it('should find a session by ID', async () => {
      const sessionId = 1;
      const session = new Session();
      session.id = sessionId;

      mockSessionRepository.findOne.mockResolvedValue(session);

      const result = await sessionService.findOne(sessionId);

      expect(result).toEqual(session);
    });

    it('should throw NotFoundException if session is not found', async () => {
      const sessionId = 1;

      mockSessionRepository.findOne.mockResolvedValue(undefined);

      try {
        await sessionService.findOne(sessionId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('update', () => {
    it('should update a session', async () => {
      const updateSessionDto: UpdateSessionDto = {
        start: new Date('2023-11-01T12:00:00Z'),
        end: new Date('2023-11-01T14:00:00Z'),
      };
      const sessionId = 1;
      const session = new Session();
      session.start = new Date('2023-11-01T10:00:00Z');
      session.end = new Date('2023-11-01T12:00:00Z');
      const movie = new Movie();
      movie.id = 5;
      session.movie = movie;
      const updateResult = { generatedMaps: [], raw: [], affected: 1 };

      jest.spyOn(sessionService, 'validateWithMovieStart');
      jest.spyOn(sessionService, 'findOne').mockResolvedValue(session);
      jest.spyOn(movieService, 'findOne').mockResolvedValue(movie);
      mockSessionRepository.create.mockReturnValue({
        ...session,
        start: updateSessionDto.start,
        end: updateSessionDto.end,
      });
      mockSessionRepository.update.mockResolvedValue(updateResult);

      const result = await sessionService.update(sessionId, updateSessionDto);

      expect(result).toEqual(updateResult);
    });

    it('should throw bad request if session start equal or after session end', async () => {
      const updateSessionDto: UpdateSessionDto = {
        start: new Date('2023-11-01T15:00:00Z'),
        end: new Date('2023-11-01T14:00:00Z'),
      };
      const sessionId = 1;
      const session = new Session();
      session.start = new Date('2023-11-01T10:00:00Z');
      session.end = new Date('2023-11-01T12:00:00Z');
      const updateResult = { generatedMaps: [], raw: [], affected: 1 };

      jest.spyOn(sessionService, 'validateWithMovieStart');
      jest.spyOn(sessionService, 'findOne').mockResolvedValue(session);
      mockSessionRepository.create.mockReturnValue({
        ...session,
        start: updateSessionDto.start,
        end: updateSessionDto.end,
      });
      mockSessionRepository.update.mockResolvedValue(updateResult);

      try {
        await sessionService.update(sessionId, updateSessionDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          'Session start should be earlier than session end!',
        );
      }
    });
  });

  describe('remove', () => {
    it('should remove a session', async () => {
      const sessionId = 1;
      const session = new Session();
      session.seats = [];
      const deleteResult = { raw: [], affected: 1 };

      mockSessionRepository.findOne.mockResolvedValue(session);
      mockSessionRepository.delete.mockResolvedValue(deleteResult);

      const result = await sessionService.remove(sessionId);

      expect(result).toEqual(deleteResult);
    });

    it('should throw conflict exception if session has seats with ticket', async () => {
      const sessionId = 1;
      const session = new Session();
      const seat = new Seat();
      seat.ticket = {
        id: 1,
        isPaid: false,
        isVisited: false,
        isMissed: false,
        discount: 10,
        seats: [],
        person: null,
      };
      session.seats = [seat];
      const deleteResult = { raw: [], affected: 1 };

      mockSessionRepository.findOne.mockResolvedValue(session);
      mockSessionRepository.delete.mockResolvedValue(deleteResult);

      try {
        await sessionService.remove(sessionId);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          'Session with seats with ticket cannot be deleted!',
        );
      }
    });
  });
});
