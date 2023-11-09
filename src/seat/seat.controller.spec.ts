import { Test, TestingModule } from '@nestjs/testing';
import { SeatController } from './seat.controller';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Seat } from './entities/seat.entity';
import { DataSource, Repository } from 'typeorm';
import { SessionService } from '../session/session.service';
import { Logger } from '@nestjs/common';
import { Session } from '../session/entities/session.entity';

describe('SeatController', () => {
  let seatController: SeatController;
  let seatService: SeatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeatController],
      providers: [
        SeatService,
        {
          provide: getRepositoryToken(Seat),
          useValue: Repository,
        },
        {
          provide: SessionService,
          useValue: {},
        },
        {
          provide: DataSource,
          useValue: {},
        },
        Logger,
      ],
    }).compile();

    seatController = module.get<SeatController>(SeatController);
    seatService = module.get<SeatService>(SeatService);
  });

  it('should be defined', () => {
    expect(seatController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new seat', async () => {
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
      const sessionId = 1;

      jest.spyOn(seatService, 'create').mockResolvedValue(seat);

      const result = await seatController.create(
        sessionId.toString(),
        createSeatDto,
      );

      expect(result).toEqual(seat);
    });
  });

  describe('generateDefault', () => {
    it('should generate default seats', async () => {
      const price = 10;
      const sessionId = 1;
      const generatedSeats = [new Seat(), new Seat()];

      jest
        .spyOn(seatService, 'generateDefault')
        .mockResolvedValue(generatedSeats);

      const result = await seatController.generateDefault(
        sessionId.toString(),
        price,
      );

      expect(result.length).toEqual(generatedSeats.length);
    });
  });

  describe('findSessionSeats', () => {
    it('should find seats for a session', async () => {
      const sessionId = 1;
      const seats = [new Seat(), new Seat()];

      jest.spyOn(seatService, 'findSessionSeats').mockResolvedValue(seats);

      const result = await seatController.findSessionSeats(
        sessionId.toString(),
      );

      expect(result).toEqual(seats);
    });
  });

  describe('update', () => {
    it('should update a seat', async () => {
      const updateSeatDto: UpdateSeatDto = {
        price: 15,
      };
      const seatId = 1;
      const updateResult = { generatedMaps: [], raw: [], affected: 1 };

      jest.spyOn(seatService, 'update').mockResolvedValue(updateResult);

      const result = await seatController.update(
        seatId.toString(),
        updateSeatDto,
      );

      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove a seat', async () => {
      const seatId = 1;
      const deleteResult = { raw: [], affected: 1 };

      jest.spyOn(seatService, 'remove').mockResolvedValue(deleteResult);

      const result = await seatController.remove(seatId.toString());

      expect(result).toEqual(deleteResult);
    });
  });
});
