import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import OrderSchema from '../../schemas/Order.model ';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Order',
				schema: OrderSchema,
			},
		]),
		AuthModule,
		MemberModule,
	],
	providers: [OrderService, OrderResolver],
	exports: [OrderService],
})
export class OrderModule {}
