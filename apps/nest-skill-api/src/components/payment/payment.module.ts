import { Module } from '@nestjs/common';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import PaymentSchema from '../../schemas/Payment.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import OrderSchema from '../../schemas/Order.model ';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Payment',
				schema: PaymentSchema,
			},
		]),
		MongooseModule.forFeature([
			{
				name: 'Order',
				schema: OrderSchema,
			},
		]),
		AuthModule,
		MemberModule,
	],
	providers: [PaymentResolver, PaymentService],
})
export class PaymentModule {}
