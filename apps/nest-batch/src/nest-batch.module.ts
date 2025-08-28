import { Module } from '@nestjs/common';
import { NestBatchController } from './nest-batch.controller';
import { NestBatchService } from './nest-batch.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from 'apps/nest-skill-api/src/schemas/Member.model';
import ProviderSchema from 'apps/nest-skill-api/src/schemas/Provider.model';

@Module({
	imports: [
		ConfigModule.forRoot(),
		DatabaseModule,
		ScheduleModule.forRoot(),
		MongooseModule.forFeature([{ name: 'Provider', schema: ProviderSchema }]),
		MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
	],
	controllers: [NestBatchController],
	providers: [NestBatchService],
})
export class NestBatchModule {}
