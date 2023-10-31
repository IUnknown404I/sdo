import { Test, TestingModule } from '@nestjs/testing';
import { ScormsService } from '../scorms.service';

describe('ScormsService', () => {
  let service: ScormsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScormsService],
    }).compile();

    service = module.get<ScormsService>(ScormsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
