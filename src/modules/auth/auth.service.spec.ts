import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PersonService } from '../person/person.service';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../token/token.service';
import { CreatePersonDto } from '../person/dto';
import { Person } from '../person/entities';
import * as bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, Logger } from '@nestjs/common';
import { AvatarService } from '../avatar/avatar.service';
import { Token } from '../token/entities';
import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let authService: AuthService;
  let personService: PersonService;
  let jwtService: JwtService;
  let tokenService: TokenService;

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

  const mockAvatarService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findByUserId: jest.fn(),
    remove: jest.fn(),
  };

  beforeAll(() => {
    dotenv.config({ path: '.env' });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        PersonService,
        {
          provide: getRepositoryToken(Person),
          useValue: mockRepository,
        },
        {
          provide: Logger,
          useValue: mockLogger,
        },
        {
          provide: AvatarService,
          useValue: mockAvatarService,
        },
        JwtService,
        TokenService,
        {
          provide: getRepositoryToken(Token),
          useValue: mockRepository,
        },
        ConfigService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    personService = module.get<PersonService>(PersonService);
    jwtService = module.get<JwtService>(JwtService);
    tokenService = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user when email and password are valid', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
        name: 'Vasya',
        surname: 'Pupkin',
        gender: 'Male',
        avatar: null,
        tickets: [],
        token: null,
      };

      jest.spyOn(personService, 'findByEmail').mockResolvedValue(user);

      const result = await authService.validateUser(
        'test@example.com',
        'password',
      );

      expect(result).toEqual(
        expect.objectContaining({ email: 'test@example.com' }),
      );
    });

    it('should return null when email is not found', async () => {
      jest.spyOn(personService, 'findByEmail').mockResolvedValue(null);

      const result = await authService.validateUser(
        'test@example.com',
        'password',
      );

      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: 'password',
        name: 'Vasya',
        surname: 'Pupkin',
        gender: 'Male',
        avatar: null,
        tickets: [],
        token: null,
      };

      jest.spyOn(personService, 'findByEmail').mockResolvedValue(user);

      const result = await authService.validateUser(
        'test@example.com',
        'wrongpassword',
      );

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should generate tokens for a user', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
        name: 'Vasya',
        surname: 'Pupkin',
        gender: 'Male',
        avatar: null,
        tickets: [],
        token: null,
      };

      jest
        .spyOn(tokenService, 'findByPersonId')
        .mockResolvedValue({ id: 1, value: 'refresh_token', person: user });
      jest.spyOn(jwtService, 'verify').mockImplementation(() => null);

      const tokens = await authService.login(user);

      expect(tokens).toHaveProperty('access_token');
      expect(tokens).toHaveProperty('refresh_token', 'refresh_token');
    });
  });

  describe('register', () => {
    it('should create a user and generate tokens', async () => {
      const userDto: CreatePersonDto = {
        name: 'Vasya',
        surname: 'Pupkin',
        email: 'newuser@example.com',
        password: 'newpassword',
      };
      const newUser: Person = {
        id: 1,
        email: userDto.email,
        password: await bcrypt.hash(userDto.password, 10),
        name: 'Vasya',
        surname: 'Pupkin',
        gender: 'Male',
        avatar: null,
        tickets: [],
        token: null,
      };
      const tokens = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      };

      jest.spyOn(personService, 'create').mockResolvedValue(newUser);
      jest.spyOn(authService, 'generateTokensForUser').mockReturnValue(tokens);
      jest.spyOn(tokenService, 'create').mockResolvedValue(null);

      const result = await authService.register(userDto);

      expect(result).toEqual(tokens);
    });
  });

  describe('refreshToken', () => {
    it('should refresh the access token when refresh token is valid', async () => {
      const userId = 1;
      const refreshToken = 'valid_refresh_token';
      const user: Person = {
        id: userId,
        email: 'test@example.com',
        password: 'password',
        name: 'Vasya',
        surname: 'Pupkin',
        gender: 'Male',
        avatar: null,
        tickets: [],
        token: null,
      };

      jest
        .spyOn(tokenService, 'findByPersonId')
        .mockResolvedValue({ id: 1, value: refreshToken, person: user });
      jest.spyOn(jwtService, 'verify').mockImplementation(() => null);
      jest.spyOn(personService, 'findOne').mockResolvedValue(user);

      const result = await authService.refreshToken(userId, refreshToken);

      expect(result).toHaveProperty('access_token');
    });

    it('should throw ForbiddenException when refresh token is invalid', async () => {
      const userId = 1;
      const refreshToken = 'invalid_refresh_token';

      jest.spyOn(tokenService, 'findByPersonId').mockResolvedValue({
        id: 1,
        value: 'valid_refresh_token',
        person: null,
      });
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Token is invalid');
      });

      await expect(
        authService.refreshToken(userId, refreshToken),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('generateTokensForUser', () => {
    it('should generate access and refresh tokens', async () => {
      const user: Person = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('hashed_password', 10),
        name: 'Vasya',
        surname: 'Pupkin',
        gender: 'Male',
        avatar: null,
        tickets: [],
        token: null,
      };

      const tokens = authService.generateTokensForUser(user);

      expect(tokens).toHaveProperty('access_token');
      expect(tokens).toHaveProperty('refresh_token');
    });
  });

  describe('thirdPartyAuth', () => {
    it('should log in an existing user', async () => {
      const userDto: CreatePersonDto = {
        name: 'Vasya',
        surname: 'Pupkin',
        email: 'existing@example.com',
        password: 'password',
      };
      const existingUser: Person = {
        id: 1,
        email: 'existing@example.com',
        password: 'hashed_password',
        name: 'Vasya',
        surname: 'Pupkin',
        gender: 'Male',
        avatar: null,
        tickets: [],
        token: null,
      };

      jest.spyOn(tokenService, 'findByPersonId').mockResolvedValue({
        id: 1,
        value: 'refresh_token',
        person: existingUser,
      });
      jest.spyOn(jwtService, 'verify').mockImplementation(() => null);
      jest.spyOn(personService, 'findByEmail').mockResolvedValue(existingUser);
      const loginSpy = jest.spyOn(authService, 'login');

      const result = await authService.thirdPartyAuth(userDto);

      expect(loginSpy).toHaveBeenCalledWith(existingUser);
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
    });

    it('should register a new user', async () => {
      const userDto: CreatePersonDto = {
        name: 'Vasya',
        surname: 'Pupkin',
        email: 'new@example.com',
        password: 'newpassword',
      };
      const newUser: Person = {
        id: 1,
        email: userDto.email,
        password: await bcrypt.hash(userDto.password, 10),
        name: 'Vasya',
        surname: 'Pupkin',
        gender: 'Male',
        avatar: null,
        tickets: [],
        token: null,
      };
      const tokens = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      };

      jest.spyOn(personService, 'create').mockResolvedValue(newUser);
      jest.spyOn(authService, 'generateTokensForUser').mockReturnValue(tokens);
      jest.spyOn(tokenService, 'create').mockResolvedValue(null);
      jest.spyOn(personService, 'findByEmail').mockResolvedValue(null);
      const registerSpy = jest.spyOn(authService, 'register');

      const result = await authService.thirdPartyAuth(userDto);

      expect(registerSpy).toHaveBeenCalledWith(userDto);
      expect(result).toEqual(tokens);
    });
  });
});
