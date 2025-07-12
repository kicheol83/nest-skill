import { Test, TestingModule } from '@nestjs/testing';
import { NestBatchController } from './nest-batch.controller';
import { NestBatchService } from './nest-batch.service';

describe('NestBatchController', () => {
  let nestBatchController: NestBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NestBatchController],
      providers: [NestBatchService],
    }).compile();

    nestBatchController = app.get<NestBatchController>(NestBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(nestBatchController.getHello()).toBe('Hello World!');
    });
  });
});
