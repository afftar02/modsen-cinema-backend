import { Test, TestingModule } from '@nestjs/testing';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import {
  BadRequestException,
  ConflictException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Seat } from './entities/seat.entity';
import { DataSource, Repository } from 'typeorm';
import { SessionService } from '../session/session.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Session } from '../session/entities/session.entity';
import { Ticket } from '../ticket/entities/ticket.entity';

describe('SeatService', () => {
  let seatService: SeatService;
  let seatRepository: Repository<Seat>;
  let sessionService: SessionService;

  const mockDataSource = {
    createQueryRunner: () => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      manager: {
        save: jest.fn().mockResolvedValue({
          id: 1,
          price: 5,
          number: 1,
          row: 1,
          session: new Session(),
          ticket: null,
        }),
      },
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    }),
  };

  const mockSessionService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeatService,
        {
          provide: getRepositoryToken(Seat),
          useClass: Repository,
        },
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        Logger,
      ],
    }).compile();

    seatService = module.get<SeatService>(SeatService);
    seatRepository = module.get(getRepositoryToken(Seat));
    sessionService = module.get<SessionService>(SessionService);
  });

  it('should be defined', () => {
    expect(seatService).toBeDefined();
  });

  describe('checkExistingSeat', () => {
    it('should not throw an exception if seat does not exist in the session', async () => {
      const sessionId = 1;
      const createSeatDto: CreateSeatDto = {
        number: 1,
        row: 1,
        price: 10,
      };
      jest.spyOn(seatService, 'findSessionSeats').mockResolvedValue([]);

      try {
        await seatService.checkExistingSeat(sessionId, createSeatDto);
      } catch (error) {
        fail('Should not throw an exception');
      }
    });

    it('should throw BadRequestException if seat already exists in the session', async () => {
      const sessionId = 1;
      const createSeatDto: CreateSeatDto = {
        number: 1,
        row: 1,
        price: 10,
      };
      const existingSeat: Seat = {
        id: 2,
        session: new Session(),
        number: 1,
        row: 1,
        price: 10,
        ticket: null,
      };
      jest
        .spyOn(seatService, 'findSessionSeats')
        .mockResolvedValue([existingSeat]);

      try {
        await seatService.checkExistingSeat(sessionId, createSeatDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          'Seat with this number and row is already exists in current session!',
        );
      }
    });
  });

  describe('create', () => {
    it('should create a seat', async () => {
      const createSeatDto: CreateSeatDto = {
        number: 1,
        row: 1,
        price: 10,
      };
      const seat: Seat = {
        id: 1,
        session: new Session(),
        number: 1,
        row: 1,
        price: 10,
        ticket: null,
      };
      jest.spyOn(seatService, 'checkExistingSeat').mockResolvedValue(undefined);
      jest.spyOn(sessionService, 'findOne').mockResolvedValue(null);
      jest.spyOn(seatRepository, 'create').mockReturnValue(seat);
      jest.spyOn(seatRepository, 'save').mockResolvedValue(seat);

      expect(await seatService.create(1, createSeatDto)).toEqual(seat);
    });

    it('should throw BadRequestException if seat already exists in the session', async () => {
      const createSeatDto: CreateSeatDto = {
        number: 1,
        row: 1,
        price: 10,
      };
      jest
        .spyOn(seatService, 'checkExistingSeat')
        .mockImplementation(async () => {
          throw new BadRequestException(
            'Seat with this number and row is already exists in current session!',
          );
        });

      try {
        await seatService.create(1, createSeatDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          'Seat with this number and row is already exists in current session!',
        );
      }
    });
  });

  describe('generateDefault', () => {
    it('should generate default seats for a session', async () => {
      const sessionId = 1;
      const price = 10;
      const seat: Seat = {
        id: 1,
        session: new Session(),
        number: 1,
        row: 1,
        price: 10,
        ticket: null,
      };
      jest.spyOn(seatService, 'create').mockResolvedValue(seat);

      const generatedSeats = await seatService.generateDefault(
        sessionId,
        price,
      );

      expect(generatedSeats.length).toBe(68);
    });

    it('should throw BadRequestException if seats cannot be generated', async () => {
      const sessionId = 1;
      const price = 10;
      jest.spyOn(seatService, 'create').mockImplementation(async () => {
        throw new BadRequestException('Unable to generate default seats');
      });

      try {
        await seatService.generateDefault(sessionId, price);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Unable to generate default seats');
      }
    });
  });

  describe('findSessionSeats', () => {
    it('should find seats for a session', async () => {
      const sessionId = 1;
      const seats = [new Seat(), new Seat()];
      jest.spyOn(sessionService, 'findOne').mockResolvedValue(null);
      jest.spyOn(seatRepository, 'find').mockResolvedValue(seats);

      const result = await seatService.findSessionSeats(sessionId);

      expect(result).toEqual(seats);
    });

    it('should throw NotFoundException if session does not exist', async () => {
      const sessionId = 1;
      jest.spyOn(sessionService, 'findOne').mockImplementation(async () => {
        throw new NotFoundException('Session not found');
      });

      try {
        await seatService.findSessionSeats(sessionId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Session not found');
      }
    });
  });

  describe('findByIds', () => {
    it('should find seats by their IDs', async () => {
      const seatIds = [1, 2, 3];
      jest
        .spyOn(seatRepository, 'findBy')
        .mockResolvedValue(seatIds.map(() => new Seat()));

      const seats = await seatService.findByIds(seatIds);

      expect(seats.length).toBe(seatIds.length);
    });
  });

  describe('findById', () => {
    it('should find a seat by its ID', async () => {
      const seatId = 1;
      const seat: Seat = {
        id: 1,
        session: new Session(),
        number: 1,
        row: 1,
        price: 10,
        ticket: null,
      };
      jest.spyOn(seatRepository, 'findOne').mockResolvedValue(seat);

      const result = await seatService.findById(seatId);

      expect(result).toBe(seat);
    });

    it('should throw NotFoundException if seat does not exist', async () => {
      const seatId = 1;
      jest.spyOn(seatRepository, 'findOne').mockImplementation(async () => {
        throw new NotFoundException('Seat not found');
      });

      try {
        await seatService.findById(seatId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Seat not found');
      }
    });
  });

  describe('update', () => {
    it('should update a seat', async () => {
      const seatId = 1;
      const updateSeatDto: UpdateSeatDto = {
        price: 10,
      };
      const seat: Seat = {
        id: 1,
        session: new Session(),
        number: 1,
        row: 1,
        price: 10,
        ticket: null,
      };
      const updateResult = { generatedMaps: [], raw: [], affected: 1 };
      jest.spyOn(seatRepository, 'findOne').mockResolvedValue(seat);
      jest.spyOn(seatService, 'checkExistingSeat').mockResolvedValue();
      jest.spyOn(seatRepository, 'update').mockResolvedValue(updateResult);

      const result = await seatService.update(seatId, updateSeatDto);

      expect(result).toBe(updateResult);
    });

    it('should throw NotFoundException if seat does not exist', async () => {
      const seatId = 1;
      const updateSeatDto: UpdateSeatDto = {
        price: 10,
      };
      jest.spyOn(seatRepository, 'findOne').mockImplementation(async () => {
        throw new NotFoundException('Seat not found');
      });

      try {
        await seatService.update(seatId, updateSeatDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Seat not found');
      }
    });
  });

  describe('remove', () => {
    it('should remove a seat', async () => {
      const seatId = 1;
      const seat: Seat = {
        id: seatId,
        session: new Session(),
        number: 1,
        row: 1,
        price: 10,
        ticket: null,
      };
      const deleteResult = { raw: [], affected: 1 };
      jest.spyOn(seatRepository, 'findOne').mockResolvedValue(seat);
      jest.spyOn(seatRepository, 'delete').mockResolvedValue(deleteResult);

      const result = await seatService.remove(seatId);

      expect(result).toEqual(deleteResult);
    });

    it('should throw NotFoundException if seat does not exist', async () => {
      const seatId = 1;
      jest.spyOn(seatRepository, 'findOne').mockResolvedValue(undefined);

      try {
        await seatService.remove(seatId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Seat not found');
      }
    });

    it('should throw ConflictException if seat has an associated ticket', async () => {
      const seatId = 1;
      const seat: Seat = {
        id: 1,
        session: new Session(),
        number: 1,
        row: 1,
        price: 10,
        ticket: new Ticket(),
      };
      jest.spyOn(seatRepository, 'findOne').mockResolvedValue(seat);

      try {
        await seatService.remove(seatId);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('Seat with ticket cannot be deleted!');
      }
    });
  });
});
