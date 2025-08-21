import { Module } from '@nestjs/common';
import { NoticeResolver } from './notice.resolver';
import { NoticeService } from './notice.service';
import { MongooseModule } from '@nestjs/mongoose';
import NoticeSchema from '../../schemas/Notice.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Notices',
				schema: NoticeSchema,
			},
		]),
		AuthModule,
		MemberModule,
	],
	providers: [NoticeResolver, NoticeService],
})
export class NoticeModule {}
