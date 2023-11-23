import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreatePersonDto } from '../person/dto';
import { ForbiddenException } from '@nestjs/common';
import { PersonService } from '../person/person.service';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../token/token.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Token } from '../token/entities';
import { ConfigService } from '@nestjs/config';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

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

  const mockPersonService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getPasswordHash: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: PersonService,
          useValue: mockPersonService,
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

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return tokens after successful login', async () => {
      const tokens = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      };

      jest.spyOn(authService, 'login').mockResolvedValue(tokens);
      const req = { user: { id: 1 } };

      const result = await authController.login(req);

      expect(result).toBe(tokens);
    });
  });

  describe('register', () => {
    it('should return tokens', async () => {
      const createUserDto: CreatePersonDto = {
        email: 'newuser@example.com',
        password: 'newpassword',
        name: 'Vasya',
        surname: 'Pupkin',
      };
      const tokens = {
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      };
      jest.spyOn(authService, 'register').mockResolvedValue(tokens);

      const result = await authController.register(createUserDto);

      expect(result).toBe(tokens);
    });
  });

  describe('refresh', () => {
    it('should refresh the access token', async () => {
      const user = { sub: 1, refreshToken: 'valid_refresh_token' };
      const refreshedToken = { access_token: 'new_access_token' };
      jest.spyOn(authService, 'refreshToken').mockResolvedValue(refreshedToken);
      const req = { user };

      const result = await authController.refresh(req);

      expect(result).toBe(refreshedToken);
    });

    it('should throw ForbiddenException if the refresh token is invalid', async () => {
      const user = { sub: 1, refreshToken: 'invalid_refresh_token' };
      jest
        .spyOn(authService, 'refreshToken')
        .mockRejectedValue(new ForbiddenException());
      const req = { user };

      await expect(authController.refresh(req)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
