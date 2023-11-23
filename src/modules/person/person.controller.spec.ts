import { Test, TestingModule } from '@nestjs/testing';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { UpdatePersonDto } from './dto';
import { Logger } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Person } from './entities';
import { Repository } from 'typeorm';
import { AvatarService } from '../avatar/avatar.service';
import { Avatar } from '../avatar/entities';

describe('PersonController', () => {
  let personController: PersonController;
  let personService: PersonService;

  const mockLogger = {
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [
        PersonService,
        {
          provide: getRepositoryToken(Person),
          useClass: Repository,
        },
        AvatarService,
        {
          provide: getRepositoryToken(Avatar),
          useClass: Repository,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
      ],
    }).compile();

    personController = module.get<PersonController>(PersonController);
    personService = module.get<PersonService>(PersonService);
  });

  it('should be defined', () => {
    expect(personController).toBeDefined();
  });

  describe('findOne', () => {
    it('should return the user', async () => {
      const userId = 1;
      const user = {
        id: userId,
        name: 'John',
        surname: 'Doe',
        email: 'john@example.com',
        password: 'password',
        gender: 'MALE',
        tickets: [],
        avatar: null,
        token: null,
      };
      const { password, ...userWithoutPassword } = user;
      jest.spyOn(personService, 'findOne').mockResolvedValue(user);

      const result = await personController.findOne(userId);

      expect(result).toEqual(userWithoutPassword);
    });
  });

  describe('update', () => {
    it('should update and return the user', async () => {
      const userId = 1;
      const updateDto: UpdatePersonDto = { email: 'newemail@example.com' };
      const user = {
        id: userId,
        name: 'John',
        surname: 'Doe',
        email: 'newemail@example.com',
        password: 'password',
        gender: 'MALE',
        tickets: [],
        avatar: null,
        token: null,
      };
      const { password, ...userWithoutPassword } = user;
      jest.spyOn(personService, 'update').mockResolvedValue(user);

      const result = await personController.update(userId, updateDto);

      expect(result).toEqual(userWithoutPassword);
    });
  });

  describe('remove', () => {
    it('should remove the user profile', async () => {
      const userId = 1;
      jest
        .spyOn(personService, 'remove')
        .mockResolvedValue({ raw: [], affected: 1 });

      const result = await personController.remove(userId);

      expect(result.affected).toBe(1);
    });
  });
});
