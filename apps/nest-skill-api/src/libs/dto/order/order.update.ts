import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { OrderStatus } from '../../enums/order.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class AddressUpdate {
	@Field(() => String, { nullable: true })
	fullName?: string;

	@Field(() => String, { nullable: true })
	phone?: string;

	@Field(() => String, { nullable: true })
	city?: string;

	@Field(() => String, { nullable: true })
	street?: string;

	@Field(() => String, { nullable: true })
	zipcode?: string;
}

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

	@Field(() => AddressUpdate, { nullable: true })
	address?: AddressUpdate;
}
