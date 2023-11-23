import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { CreateTicketDto, UpdateTicketDto } from './dto';
import { Ticket } from './entities';
import { SeatService } from '../seat/seat.service';
import {
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Session } from '../session/entities';
import { Seat } from '../seat/entities';

describe('TicketService', () => {
  let ticketService: TicketService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockSeatService = {
    findByIds: jest.fn(),
    findById: jest.fn(),
  };

  const mockLogger = {
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: getRepositoryToken(Ticket),
          useValue: mockRepository,
        },
        {
          provide: SeatService,
          useValue: mockSeatService,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    ticketService = module.get<TicketService>(TicketService);
  });

  it('should be defined', () => {
    expect(ticketService).toBeDefined();
  });

  describe('calculateDiscount', () => {
    it('should calculate discount correctly', async () => {
      mockSeatService.findById.mockResolvedValue({
        id: 1,
        number: 1,
        row: 1,
        session: {
          start: new Date(),
        },
      });
      const ticket = new Ticket();
      ticket.seats = [
        {
          id: 1,
          number: 1,
          row: 1,
          price: 5,
          session: new Session(),
          ticket: null,
        },
      ];

      const currentDateResult = await ticketService.calculateDiscount(ticket);

      expect(currentDateResult).toBe(0);
    });

    it('should calculate discount for 5 days correctly', async () => {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + 5);

      const ticket = new Ticket();
      ticket.seats = [
        {
          id: 1,
          number: 1,
          row: 1,
          price: 5,
          session: new Session(),
          ticket: null,
        },
      ];

      mockSeatService.findById.mockResolvedValue({
        id: 1,
        number: 1,
        row: 1,
        session: {
          start: newDate,
        },
      });

      const fiveDaysResult = await ticketService.calculateDiscount(ticket);

      expect(fiveDaysResult).toBe(25);
    });
  });

  describe('checkFoundSeats', () => {
    it('should not throw an exception if the number of seats matches', () => {
      const ticket: Ticket = { seats: [new Seat(), new Seat()] } as Ticket;
      const createTicketDto: CreateTicketDto = {
        seatIds: [1, 2],
        isPaid: false,
        isMissed: false,
        isVisited: false,
      };

      expect(() =>
        ticketService.checkFoundSeats(ticket, createTicketDto),
      ).not.toThrowError(BadRequestException);
    });

    it('should throw an exception if the number of seats does not match', () => {
      const ticket: Ticket = { seats: [new Seat(), new Seat()] } as Ticket;
      const createTicketDto: CreateTicketDto = {
        seatIds: [1, 2, 3],
        isPaid: false,
        isVisited: false,
        isMissed: false,
      };

      expect(() =>
        ticketService.checkFoundSeats(ticket, createTicketDto),
      ).toThrowError();
    });
  });

  describe('checkForSessionEnd', () => {
    it('should throw BadRequestException if the session is ended', async () => {
      const ticket: Ticket = {
        seats: [{ id: 1 }],
      } as Ticket;

      mockSeatService.findById.mockResolvedValue({
        id: 1,
        number: 1,
        row: 1,
        session: {
          end: new Date(2022, 0, 1),
        },
      });

      try {
        await ticketService.checkForSessionEnd(ticket);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should not throw an exception if the session is not ended', async () => {
      const ticket: Ticket = {
        seats: [{ id: 1 }],
      } as Ticket;

      mockSeatService.findById.mockResolvedValue({
        id: 1,
        number: 1,
        row: 1,
        session: {
          end: new Date(2030, 0, 1),
        },
      });

      expect(
        async () => await ticketService.checkForSessionEnd(ticket),
      ).not.toThrowError();
    });
  });

  describe('checkForBookedSeats', () => {
    it('should throw BadRequestException if any of the seats is already booked', async () => {
      const seatIds = [1, 2, 3];
      mockSeatService.findById.mockResolvedValue({ ticket: new Ticket() });

      try {
        await ticketService.checkForBookedSeats(seatIds);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should not throw an exception if none of the seats are booked', async () => {
      const seatIds = [1, 2, 3];
      mockSeatService.findById.mockResolvedValue({ ticket: null });

      expect(
        async () => await ticketService.checkForBookedSeats(seatIds),
      ).not.toThrowError();
    });
  });

  describe('checkForSameSession', () => {
    it('should throw BadRequestException if the seats are from different sessions', async () => {
      const seatIds = [1, 2, 3];
      mockSeatService.findById.mockResolvedValueOnce({ session: { id: 1 } });
      mockSeatService.findById.mockResolvedValueOnce({ session: { id: 2 } });
      mockSeatService.findById.mockResolvedValueOnce({ session: { id: 1 } });

      try {
        await ticketService.checkForSameSession(seatIds);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should not throw an exception if the seats are from the same session', async () => {
      const seatIds = [1, 2, 3];
      mockSeatService.findById.mockResolvedValue({ session: { id: 1 } });

      expect(
        async () => await ticketService.checkForSameSession(seatIds),
      ).not.toThrowError();
    });
  });

  describe('create', () => {
    it('should create a ticket and return it', async () => {
      const personId = 1;
      const createTicketDto: CreateTicketDto = {
        seatIds: [1, 2, 3],
        isPaid: false,
        isMissed: false,
        isVisited: false,
      };
      const ticket = new Ticket();
      const seats = [{ id: 1 }, { id: 2 }, { id: 3 }] as Seat[];
      const expectedResult = {
        ...ticket,
        person: {
          id: personId,
        },
      };

      mockRepository.create.mockReturnValue(ticket);
      mockSeatService.findByIds.mockResolvedValue(seats);
      mockSeatService.findById.mockResolvedValue({
        ticket: null,
        session: {
          id: 1,
          start: new Date('2030-01-01'),
          end: new Date('2030-01-01'),
        },
      });
      mockRepository.save.mockReturnValue(expectedResult);

      jest.spyOn(ticketService, 'calculateDiscount').mockResolvedValue(10);

      const result = await ticketService.create(personId, createTicketDto);

      expect(result).toBe(expectedResult);
    });
  });

  describe('findOne', () => {
    it('should find and return a ticket with valid person', async () => {
      const personId = 1;
      const ticketId = 2;
      const ticket = {
        id: 1,
        person: { id: personId },
        seats: [
          {
            id: 1,
            session: {
              id: 1,
              movie: { id: 1 },
            },
          },
        ],
        isMissed: true,
      } as Ticket;

      mockRepository.findOne.mockResolvedValue(ticket);

      const result = await ticketService.findOne(personId, ticketId);

      expect(result).toEqual({
        id: 1,
        isMissed: true,
        seats: [{ id: 1 }],
        session: { id: 1 },
        movie: { id: 1 },
      });
    });

    it('should throw NotFoundException if the ticket is not found', async () => {
      const personId = 1;
      const ticketId = 2;

      mockRepository.findOne.mockResolvedValue(undefined);

      try {
        await ticketService.findOne(personId, ticketId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw ForbiddenException if the person is not valid', async () => {
      const personId = 1;
      const ticketId = 2;
      const ticket = { person: { id: 3 } } as Ticket;

      mockRepository.findOne.mockResolvedValue(ticket);

      try {
        await ticketService.findOne(personId, ticketId);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('update', () => {
    it('should update and return the ticket', async () => {
      const personId = 1;
      const ticketId = 2;
      const dto: UpdateTicketDto = { isPaid: true, seatIds: [1, 2, 3] };
      const seats = [
        { id: 1, session: { id: 1 } },
        { id: 2, session: { id: 1 } },
        { id: 3, session: { id: 1 } },
      ] as Seat[];
      const ticket = {
        person: { id: personId },
        isMissed: true,
        seats,
      } as Ticket;

      mockRepository.findOne.mockResolvedValue(ticket);
      mockSeatService.findByIds.mockResolvedValue(seats);
      mockRepository.create.mockReturnValue(ticket);
      mockSeatService.findById.mockResolvedValue({
        ticket: null,
        session: {
          id: 1,
          start: new Date('2030-01-01'),
          end: new Date('2030-01-01'),
        },
      });
      mockRepository.save.mockReturnValue(ticket);

      jest.spyOn(ticketService, 'calculateDiscount').mockResolvedValue(10);

      const result = await ticketService.update(personId, ticketId, dto);

      expect(result).toBe(ticket);
    });
  });

  describe('markMissed', () => {
    it('should mark the ticket as missed if the conditions are met', async () => {
      const currentDate = new Date();
      const sessionStart = new Date(currentDate);
      sessionStart.setMinutes(currentDate.getMinutes() - 1);

      const ticket: Ticket = {
        id: 1,
        isMissed: false,
        isPaid: false,
        seats: [{ session: { start: sessionStart } }],
      } as Ticket;

      mockRepository.findOne.mockResolvedValue(ticket);

      await ticketService.markMissed(ticket);

      expect(ticket.isMissed).toBe(true);
    });

    it('should not mark the ticket as missed if the conditions are not met', async () => {
      const currentDate = new Date();
      const sessionStart = new Date(currentDate);
      sessionStart.setMinutes(currentDate.getMinutes() + 5);

      const ticket: Ticket = {
        id: 1,
        isMissed: false,
        isPaid: false,
        seats: [{ session: { start: sessionStart } }],
      } as Ticket;

      mockRepository.findOne.mockResolvedValue(ticket);

      await ticketService.markMissed(ticket);

      expect(ticket.isMissed).toBe(false);
    });

    it('should not mark the ticket as missed if it is already marked as missed', async () => {
      const currentDate = new Date();
      const sessionStart = new Date(currentDate);
      sessionStart.setMinutes(currentDate.getMinutes() - 1);

      const ticket: Ticket = {
        id: 1,
        isMissed: true,
        isPaid: false,
        seats: [{ session: { start: sessionStart } }],
      } as Ticket;

      mockRepository.findOne.mockResolvedValue(ticket);

      await ticketService.markMissed(ticket);

      expect(ticket.isMissed).toBe(true);
    });

    it('should not mark the ticket as missed if it is already paid', async () => {
      const currentDate = new Date();
      const sessionStart = new Date(currentDate);
      sessionStart.setMinutes(currentDate.getMinutes() - 1);

      const ticket: Ticket = {
        id: 1,
        isMissed: false,
        isPaid: true,
        seats: [{ session: { start: sessionStart } }],
      } as Ticket;

      mockRepository.findOne.mockResolvedValue(ticket);

      await ticketService.markMissed(ticket);

      expect(ticket.isMissed).toBe(false);
    });
  });

  describe('findByPersonId', () => {
    it('should find and return tickets by person ID', async () => {
      const personId = 1;
      const ticket = {
        id: 1,
        person: { id: personId },
        seats: [
          {
            id: 1,
            session: {
              id: 1,
              movie: { id: 1 },
            },
          },
        ],
        isMissed: true,
        isPaid: false,
      } as Ticket;
      const tickets = [ticket, ticket] as Ticket[];

      mockRepository.find.mockResolvedValue(tickets);

      const result = await ticketService.findByPersonId(personId, 'en');

      expect(result.length).toBe(2);
    });
  });

  describe('remove', () => {
    it('should remove a ticket and return true', async () => {
      const personId = 1;
      const ticketId = 2;
      const ticket = {
        id: 1,
        person: { id: personId },
        seats: [
          {
            id: 1,
            session: {
              id: 1,
              movie: { id: 1 },
            },
          },
        ],
        isMissed: true,
        isPaid: false,
      } as Ticket;
      const expectedResult = { raw: [], affected: 1 };

      mockRepository.findOne.mockResolvedValue(ticket);
      mockRepository.delete.mockResolvedValue(expectedResult);

      const result = await ticketService.remove(personId, ticketId);

      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if the ticket is not found', async () => {
      const personId = 1;
      const ticketId = 2;

      mockRepository.findOne.mockResolvedValue(undefined);

      try {
        await ticketService.remove(personId, ticketId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw ForbiddenException if the person is not valid', async () => {
      const personId = 1;
      const ticketId = 2;
      const ticket = { person: { id: 3 } } as Ticket;

      mockRepository.findOne.mockResolvedValue(ticket);

      try {
        await ticketService.remove(personId, ticketId);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });
});
