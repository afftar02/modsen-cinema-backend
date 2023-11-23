import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from './person.service';
import { CreatePersonDto, UpdatePersonDto } from './dto';
import { Person } from './entities';
import { AvatarService } from '../avatar/avatar.service';
import { NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Avatar } from '../avatar/entities';

describe('PersonService', () => {
  let personService: PersonService;
  let avatarService: AvatarService;
  let personRepository: Repository<Person>;

  const mockLogger = {
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    personService = module.get<PersonService>(PersonService);
    avatarService = module.get<AvatarService>(AvatarService);
    personRepository = module.get(getRepositoryToken(Person));
  });

  it('should be defined', () => {
    expect(personService).toBeDefined();
  });

  describe('create', () => {
    it('should create a person', async () => {
      const createDto: CreatePersonDto = {
        name: 'John',
        surname: 'Doe',
        email: 'test@example.com',
        password: 'password',
      };
      const person = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        email: 'test@example.com',
        password: 'password',
        gender: 'MALE',
        tickets: [],
        avatar: null,
        token: null,
      };
      jest.spyOn(personService, 'findByEmail').mockResolvedValue(undefined);
      jest.spyOn(personRepository, 'create').mockReturnValue(person);
      jest
        .spyOn(personService, 'getPasswordHash')
        .mockResolvedValue('hashedPassword');
      jest.spyOn(personRepository, 'save').mockResolvedValue(person);

      const result = await personService.create(createDto);

      expect(result).toBe(person);
    });

    it('should throw ConflictException if person with the same email exists', async () => {
      const createDto: CreatePersonDto = {
        name: 'John',
        surname: 'Doe',
        email: 'test@example.com',
        password: 'password',
      };
      const person = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        email: 'test@example.com',
        password: 'password',
        gender: 'MALE',
        tickets: [],
        avatar: null,
        token: null,
      };
      jest.spyOn(personService, 'findByEmail').mockResolvedValue(person);

      try {
        await personService.create(createDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('Person with this email is already exists');
      }
    });
  });

  describe('findOne', () => {
    it('should find a person by ID', async () => {
      const person = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        email: 'test@example.com',
        password: 'password',
        gender: 'MALE',
        tickets: [],
        avatar: null,
        token: null,
      };
      jest.spyOn(personRepository, 'findOne').mockResolvedValue(person);

      const result = await personService.findOne(1);

      expect(result).toBe(person);
    });

    it('should throw NotFoundException if person with given ID does not exist', async () => {
      jest.spyOn(personRepository, 'findOne').mockResolvedValue(undefined);

      try {
        await personService.findOne(1);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Person not found');
      }
    });
  });

  describe('update', () => {
    it('should update a person', async () => {
      const updateDto: UpdatePersonDto = {
        email: 'newemail@example.com',
        password: 'newpassword',
      };
      const person = {
        id: 1,
        name: 'John',
        surname: 'Doe',
        email: 'test@example.com',
        password: 'password',
        gender: 'MALE',
        tickets: [],
        avatar: null,
        token: null,
      };
      jest.spyOn(personService, 'findOne').mockResolvedValue(person);
      jest.spyOn(personRepository, 'create').mockReturnValue(person);
      jest
        .spyOn(personService, 'getPasswordHash')
        .mockResolvedValue('newhashedPassword');
      jest.spyOn(personRepository, 'save').mockResolvedValue(person);

      const result = await personService.update(1, updateDto);

      expect(result).toBe(person);
    });
  });

  describe('remove', () => {
    it('should remove a person by ID', async () => {
      const person = new Person();
      person.avatar = {
        id: 1,
        filename: 'avatar.png',
        mimetype: 'image/png',
        size: 1234,
        person,
      };
      jest.spyOn(personService, 'findOne').mockResolvedValue(person);
      jest.spyOn(avatarService, 'remove').mockResolvedValue(undefined);
      jest
        .spyOn(personRepository, 'delete')
        .mockResolvedValue({ raw: [], affected: 1 });

      const result = await personService.remove(1);

      expect(result.affected).toBe(1);
    });
  });
});
