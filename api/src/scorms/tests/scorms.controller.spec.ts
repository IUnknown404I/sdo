import { Test, TestingModule } from '@nestjs/testing';
import { ScormsController } from '../scorms.controller';

describe('ScormsController', () => {
  let controller: ScormsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScormsController],
    }).compile();

    controller = module.get<ScormsController>(ScormsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
