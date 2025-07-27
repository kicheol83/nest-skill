import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { OrderStatus } from '../../enums/order.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class UpdateOrderInput {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Min(0)
	@Field(() => Int, { nullable: true })
	orderPrice?: number;

	@IsOptional()
	@Min(0)
	@Field(() => Int, { nullable: true })
	webTax?: number;

	@IsOptional()
	@Min(0)
	@Field(() => Int, { nullable: true })
	totalPrice?: number;

	@IsOptional()
	@Field(() => OrderStatus, { nullable: true })
	orderStatus?: OrderStatus;

	@IsOptional()
	@Field(() => String, { nullable: true })
	providerId?: string;
}
