import { Module } from '@nestjs/common';
import { NestBatchController } from './nest-batch.controller';
import { NestBatchService } from './nest-batch.service';

@Module({
  imports: [],
  controllers: [NestBatchController],
  providers: [NestBatchService],
})
export class NestBatchModule {}
