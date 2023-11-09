import { Test, TestingModule } from '@nestjs/testing';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('TicketController', () => {
  let ticketController: TicketController;

  const mockTicketService = {
    create: jest.fn(),
    findByPersonId: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketController],
      providers: [
        {
          provide: TicketService,
          useValue: mockTicketService,
        },
      ],
    }).compile();

    ticketController = module.get<TicketController>(TicketController);
  });

  it('should be defined', () => {
    expect(ticketController).toBeDefined();
  });

  describe('create', () => {
    it('should create a ticket and return it', async () => {
      const userId = 1;
      const createTicketDto = {} as CreateTicketDto;
      const createdTicket = {} as CreateTicketDto;

      mockTicketService.create.mockResolvedValue(createdTicket);

      const result = await ticketController.create(userId, createTicketDto);

      expect(result).toBe(createdTicket);
      expect(mockTicketService.create).toHaveBeenCalledWith(
        userId,
        createTicketDto,
      );
    });
  });

  describe('findByPersonId', () => {
    it('should find tickets by person ID and return them', async () => {
      const userId = 1;
      const language = 'en';
      const tickets = [] as CreateTicketDto[];

      mockTicketService.findByPersonId.mockResolvedValue(tickets);

      const result = await ticketController.findByPersonId(userId, language);

      expect(result).toBe(tickets);
      expect(mockTicketService.findByPersonId).toHaveBeenCalledWith(
        userId,
        language,
      );
    });
  });

  describe('findOne', () => {
    it('should find a ticket by ID and return it', async () => {
      const userId = 1;
      const ticketId = '2';
      const language = 'en';
      const ticket = {} as CreateTicketDto;

      mockTicketService.findOne.mockResolvedValue(ticket);

      const result = await ticketController.findOne(userId, ticketId, language);

      expect(result).toBe(ticket);
      expect(mockTicketService.findOne).toHaveBeenCalledWith(
        userId,
        +ticketId,
        language,
      );
    });

    it('should throw NotFoundException if the ticket is not found', async () => {
      const userId = 1;
      const ticketId = '2';
      const language = 'en';

      mockTicketService.findOne.mockResolvedValue(undefined);

      try {
        await ticketController.findOne(userId, ticketId, language);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should throw ForbiddenException if the person does not have access', async () => {
      const userId = 1;
      const ticketId = '2';
      const language = 'en';

      mockTicketService.findOne.mockRejectedValue(new ForbiddenException());

      try {
        await ticketController.findOne(userId, ticketId, language);
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });

  describe('update', () => {
    it('should update a ticket and return it', async () => {
      const userId = 1;
      const ticketId = '2';
      const updateTicketDto = {} as UpdateTicketDto;
      const updatedTicket = {} as UpdateTicketDto;

      mockTicketService.update.mockResolvedValue(updatedTicket);

      const result = await ticketController.update(
        userId,
        ticketId,
        updateTicketDto,
      );

      expect(result).toBe(updatedTicket);
      expect(mockTicketService.update).toHaveBeenCalledWith(
        userId,
        +ticketId,
        updateTicketDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a ticket and return true', async () => {
      const userId = 1;
      const ticketId = '2';
      const expectedResult = { raw: [], affected: 1 };

      mockTicketService.remove.mockResolvedValue(expectedResult);

      const result = await ticketController.remove(userId, ticketId);

      expect(result).toEqual(expectedResult);
      expect(mockTicketService.remove).toHaveBeenCalledWith(userId, +ticketId);
    });
  });
});
