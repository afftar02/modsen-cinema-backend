import { Test, TestingModule } from '@nestjs/testing';
import { TrailerController } from './trailer.controller';
import { TrailerService } from './trailer.service';

describe('TrailerController', () => {
  let controller: TrailerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrailerController],
      providers: [TrailerService],
    }).compile();

    controller = module.get<TrailerController>(TrailerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
