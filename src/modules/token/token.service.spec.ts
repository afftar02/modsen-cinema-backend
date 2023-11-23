import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { Token } from './entities/token.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TokenService', () => {
  let tokenService: TokenService;

  const mockTokenRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: getRepositoryToken(Token),
          useValue: mockTokenRepository,
        },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  describe('create', () => {
    it('should create a token and return it', async () => {
      const personId = 1;
      const value = 'myToken';
      const createdToken = { value } as Token;
      const expectedResult = {
        ...createdToken,
        person: { id: personId },
      };

      mockTokenRepository.create.mockReturnValue(createdToken);
      mockTokenRepository.save.mockResolvedValue(expectedResult);

      const result = await tokenService.create(personId, value);

      expect(result).toEqual(expectedResult);
    });
  });

  describe('findByPersonId', () => {
    it('should find a token by person ID and return it', async () => {
      const personId = 1;
      const token = { value: 'token' } as Token;

      mockTokenRepository.findOne.mockResolvedValue(token);

      const result = await tokenService.findByPersonId(personId);

      expect(result).toBe(token);
    });
  });

  describe('update', () => {
    it('should update a token and return the updated value', async () => {
      const tokenId = 1;
      const updatedValue = 'updatedToken';
      const updateResult = { affected: 1 };

      mockTokenRepository.update.mockResolvedValue(updateResult);

      const result = await tokenService.update(tokenId, updatedValue);

      expect(result).toBe(updateResult);
    });
  });
});
