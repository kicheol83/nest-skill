import { Module } from '@nestjs/common';
import { ProviderPostService } from './provider-post.service';
import { ProviderPostResolver } from './provider-post.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import ProviderSchema from '../../schemas/Provider.model';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { MemberModule } from '../member/member.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Provider',
				schema: ProviderSchema,
			},
		]),
		AuthModule,
		ViewModule,
		MemberModule,
	],
	providers: [ProviderPostService, ProviderPostResolver],
})
export class ProviderPostModule {}
