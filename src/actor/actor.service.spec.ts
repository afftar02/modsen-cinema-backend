import { Test, TestingModule } from '@nestjs/testing';
import { ActorService } from './actor.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Actor } from './entities/actor.entity';
import { CreateActorDto } from './dto/create-actor.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { UpdateActorDto } from './dto/update-actor.dto';

describe('ActorService', () => {
  let actorService: ActorService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
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
        ActorService,
        {
          provide: getRepositoryToken(Actor),
          useValue: mockRepository,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    actorService = module.get<ActorService>(ActorService);
  });

  it('should be defined', () => {
    expect(actorService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new actor', async () => {
      const createDto: CreateActorDto = {
        name: 'John',
        surname: 'Doe',
      };

      mockRepository.findOneBy.mockResolvedValue(undefined);
      mockRepository.save.mockResolvedValue(createDto);

      const result = await actorService.create(createDto);

      expect(result).toEqual(createDto);
    });

    it('should throw BadRequestException if actor already exists', async () => {
      const createDto: CreateActorDto = {
        name: 'John',
        surname: 'Doe',
      };

      mockRepository.findOneBy.mockResolvedValue(createDto);

      await expect(actorService.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findByNameAndSurname', () => {
    it('should find an actor by name and surname', async () => {
      const name = 'John';
      const surname = 'Doe';
      const expectedActor = { id: 1, name, surname };

      mockRepository.findOneBy.mockResolvedValue(expectedActor);

      const result = await actorService.findByNameAndSurname(name, surname);

      expect(result).toEqual(expectedActor);
    });

    it('should return undefined if actor is not found', async () => {
      const name = 'Jane';
      const surname = 'Smith';

      mockRepository.findOneBy.mockResolvedValue(undefined);

      const result = await actorService.findByNameAndSurname(name, surname);

      expect(result).toBeUndefined();
    });
  });

  describe('findOne', () => {
    it('should find an actor by ID', async () => {
      const actorId = 1;
      const actor = { id: actorId, name: 'John', surname: 'Doe' };

      mockRepository.findOne.mockResolvedValue(actor);

      const result = await actorService.findOne(actorId);

      expect(result).toEqual(actor);
    });

    it('should throw NotFoundException if actor is not found', async () => {
      const actorId = 1;

      mockRepository.findOne.mockResolvedValue(undefined);

      await expect(actorService.findOne(actorId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of actors', async () => {
      const actors = [
        { id: 1, name: 'John', surname: 'Doe' },
        { id: 2, name: 'Jane', surname: 'Smith' },
      ];

      mockRepository.find.mockResolvedValue(actors);

      const result = await actorService.findAll();

      expect(result).toEqual(actors);
    });
  });

  describe('findByIds', () => {
    it('should return an array of actors for valid IDs', async () => {
      const actorIds = [1, 2, 3];
      const actors = [
        { id: 1, name: 'John', surname: 'Doe' },
        { id: 2, name: 'Jane', surname: 'Smith' },
        { id: 3, name: 'Bob', surname: 'Johnson' },
      ];

      mockRepository.findBy.mockResolvedValue(actors);

      const result = await actorService.findByIds(actorIds);

      expect(result).toEqual(actors);
    });
  });

  describe('update', () => {
    it('should update an actor', async () => {
      const actorId = 1;
      const updateDto: UpdateActorDto = {
        name: 'NewName',
      };
      const actor = { id: actorId, name: 'John', surname: 'Doe' };

      mockRepository.findOne.mockResolvedValue(actor);
      mockRepository.findOneBy.mockResolvedValue(undefined);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await actorService.update(actorId, updateDto);

      expect(result).toEqual({ affected: 1 });
    });

    it('should throw NotFoundException if actor is not found for updating', async () => {
      const actorId = 1;
      const updateDto: UpdateActorDto = {
        name: 'NewName',
      };

      mockRepository.findOne.mockResolvedValue(undefined);

      await expect(actorService.update(actorId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove an actor', async () => {
      const actorId = 1;
      const actor = { id: actorId, name: 'John', surname: 'Doe' };

      mockRepository.findOne.mockResolvedValue(actor);
      mockRepository.remove.mockResolvedValue({ affected: 1 });

      const result = await actorService.remove(actorId);

      expect(result).toEqual({ affected: 1 });
    });

    it('should throw NotFoundException if actor is not found for removal', async () => {
      const actorId = 1;

      mockRepository.findOne.mockResolvedValue(undefined);

      await expect(actorService.remove(actorId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
