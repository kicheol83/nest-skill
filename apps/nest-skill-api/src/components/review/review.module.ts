import { Module } from '@nestjs/common';
import { ReviewResolver } from './review.resolver';
import { ReviewService } from './review.service';
import ReviewSchema from '../../schemas/Review.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { MongooseModule } from '@nestjs/mongoose';
import OrderItemSchema from '../../schemas/OrderItem.model';
import OrderSchema from '../../schemas/Order.model ';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: 'Review',
				schema: ReviewSchema,
			},
		]),
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
	],
	providers: [ReviewResolver, ReviewService],
	exports: [ReviewService],
})
export class ReviewModule {}
