import { Module } from '@nestjs/common';
import { NestBatchController } from './nest-batch.controller';
import { NestBatchService } from './nest-batch.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [NestBatchController],
  providers: [NestBatchService],
})
export class NestBatchModule {}
