import { Injectable } from '@nestjs/common';

@Injectable()
export class NestBatchService {
  getHello(): string {
    return 'Welcome to Nest Skill BATCH server!';
  }
}
