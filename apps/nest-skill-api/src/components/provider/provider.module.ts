import { Module } from '@nestjs/common';
import { ProviderResolver } from './provider.resolver';
import { ProviderService } from './provider.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import ProviderSchema from '../../schemas/Provider.model';

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
	],
	providers: [ProviderResolver, ProviderService],
})
export class ProviderModule {}
