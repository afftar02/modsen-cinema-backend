import { Test, TestingModule } from '@nestjs/testing';
import { ActorController } from './actor.controller';
import { ActorService } from './actor.service';
import { CreateActorDto, UpdateActorDto } from './dto';
import { Logger, NotFoundException } from '@nestjs/common';
import { Actor } from './entities';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ActorController', () => {
  let actorController: ActorController;
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
      controllers: [ActorController],
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

    actorController = module.get<ActorController>(ActorController);
    actorService = module.get<ActorService>(ActorService);
  });

  it('should be defined', () => {
    expect(actorController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new actor', async () => {
      const createDto: CreateActorDto = {
        name: 'John',
        surname: 'Doe',
      };
      const actor: Actor = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        movies: [],
      };

      jest.spyOn(actorService, 'create').mockImplementation(async () => actor);

      const result = await actorController.create(createDto);

      expect(result).toEqual(actor);
    });
  });

  describe('findAll', () => {
    it('should return an array of actors', async () => {
      const actors = [
        { id: 1, name: 'John', surname: 'Doe', movies: [] },
        { id: 2, name: 'Jane', surname: 'Smith', movies: [] },
      ];

      jest
        .spyOn(actorService, 'findAll')
        .mockImplementation(async () => actors);

      const result = await actorController.findAll();

      expect(result).toEqual(actors);
    });
  });

  describe('findOne', () => {
    it('should return an actor by ID', async () => {
      const actorId = '1';
      const actor = { id: 1, name: 'John', surname: 'Doe', movies: [] };

      jest.spyOn(actorService, 'findOne').mockImplementation(async () => actor);

      const result = await actorController.findOne(actorId);

      expect(result).toEqual(actor);
    });

    it('should throw NotFoundException if actor is not found', async () => {
      const actorId = '1';

      jest.spyOn(actorService, 'findOne').mockImplementation(async () => {
        throw new NotFoundException();
      });

      await expect(actorController.findOne(actorId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an actor', async () => {
      const actorId = '1';
      const updateDto: UpdateActorDto = {
        name: 'NewName',
      };
      const updateResult = { generatedMaps: [], raw: [], affected: 1 };

      jest
        .spyOn(actorService, 'update')
        .mockImplementation(async () => updateResult);

      const result = await actorController.update(actorId, updateDto);

      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove an actor', async () => {
      const actorId = '1';
      const removeResult = { id: 1, name: 'John', surname: 'Doe', movies: [] };

      jest
        .spyOn(actorService, 'remove')
        .mockImplementation(async () => removeResult);

      const result = await actorController.remove(actorId);

      expect(result).toEqual(removeResult);
    });
  });
});
