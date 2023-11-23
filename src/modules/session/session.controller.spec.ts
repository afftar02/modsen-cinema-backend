import { Test, TestingModule } from '@nestjs/testing';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';
import { Movie } from '../movie/entities/movie.entity';

describe('SessionController', () => {
  let sessionController: SessionController;

  const mockSessionService = {
    create: jest.fn(),
    findMovieSessions: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionController],
      providers: [
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
      ],
    }).compile();

    sessionController = module.get<SessionController>(SessionController);
  });

  it('should be defined', () => {
    expect(sessionController).toBeDefined();
  });

  describe('create', () => {
    it('should create a session and return it', async () => {
      const movieId = 1;
      const createSessionDto: CreateSessionDto = {
        start: new Date(),
        end: new Date(),
        format: '2D',
      };
      const session: Session = {
        id: 1,
        ...createSessionDto,
        movie: new Movie(),
        seats: [],
      };

      mockSessionService.create.mockResolvedValue(session);

      const result = await sessionController.create(
        movieId.toString(),
        createSessionDto,
      );

      expect(result).toBe(session);
    });
  });

  describe('findMovieSessions', () => {
    it('should find movie sessions and return them', async () => {
      const movieId = 1;
      const date = new Date('2023-11-01');

      const sessions: Session[] = [
        {
          id: 1,
          start: new Date('2023-11-01T10:00:00Z'),
          end: new Date('2023-11-01T12:00:00Z'),
          format: '2D',
          movie: new Movie(),
          seats: [],
        },
        {
          id: 2,
          start: new Date('2023-11-01T14:00:00Z'),
          end: new Date('2023-11-01T16:00:00Z'),
          format: '3D',
          movie: new Movie(),
          seats: [],
        },
      ];

      mockSessionService.findMovieSessions.mockResolvedValue(sessions);

      const result = await sessionController.findMovieSessions(
        movieId.toString(),
        date,
      );

      expect(result).toBe(sessions);
    });
  });

  describe('update', () => {
    it('should update a session and return it', async () => {
      const sessionId = 1;
      const updateSessionDto: UpdateSessionDto = {
        start: new Date('2024-01-01'),
        end: new Date('2024-01-02'),
      };
      const updatedSession: Session = {
        id: sessionId,
        start: new Date('2024-01-01'),
        end: new Date('2024-01-02'),
        format: '2D',
        movie: new Movie(),
        seats: [],
      };

      mockSessionService.update.mockResolvedValue(updatedSession);

      const result = await sessionController.update(
        sessionId.toString(),
        updateSessionDto,
      );

      expect(result).toBe(updatedSession);
    });
  });

  describe('remove', () => {
    it('should remove a session and return undefined', async () => {
      const sessionId = 1;
      const deletedSession: Session = {
        id: sessionId,
        start: new Date('2024-01-01'),
        end: new Date('2024-01-02'),
        format: '2D',
        movie: new Movie(),
        seats: [],
      };

      mockSessionService.remove.mockResolvedValue(deletedSession);

      const result = await sessionController.remove(sessionId.toString());

      expect(result).toBe(deletedSession);
    });
  });
});
