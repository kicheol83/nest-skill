import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import OrderSchema from '../../schemas/Order.model ';
import OrderItemSchema from '../../schemas/OrderItem.model';
import MemberSchema from '../../schemas/Member.model';
import ProviderSchema from '../../schemas/Provider.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Order',
				schema: OrderSchema,
			},
		]),
		MongooseModule.forFeature([
			{
				name: 'OrderItems',
				schema: OrderItemSchema,
			},
		]),
		AuthModule,
		MemberModule,
		MongooseModule.forFeature([{ name: 'Provider', schema: ProviderSchema }]),
	],
	providers: [OrderService, OrderResolver],
	exports: [OrderService],
})
export class OrderModule {}
