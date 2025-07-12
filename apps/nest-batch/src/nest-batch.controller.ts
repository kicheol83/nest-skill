import { Controller, Get } from '@nestjs/common';
import { NestBatchService } from './nest-batch.service';

@Controller()
export class NestBatchController {
  constructor(private readonly nestBatchService: NestBatchService) {}

  @Get()
  getHello(): string {
    return this.nestBatchService.getHello();
  }
}
