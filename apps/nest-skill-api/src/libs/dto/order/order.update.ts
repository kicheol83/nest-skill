import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, Min } from 'class-validator';
import { OrderStatus } from '../../enums/order.enum';

@InputType()
export class UpdateOrderInput {
	@IsOptional()
	@Field(() => String)
	id: string;

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
}
