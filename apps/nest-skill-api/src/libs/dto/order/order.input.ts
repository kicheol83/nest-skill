import { InputType, Field, Int } from '@nestjs/graphql';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Direction } from '../../enums/common.enum';
import { availableOrdersSorts } from '../../config';
import { OrderStatus } from '../../enums/order.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class AddressInput {
	@Field(() => String)
	fullName: string;

	@Field(() => String)
	phone: string;

	@Field(() => String)
	city: string;

	@Field(() => String)
	street: string;

	@Field(() => String, { nullable: true })
	zipcode?: string;
}

@InputType()
export class CreateOrderInput {
	@IsInt()
	@Min(0)
	@Field(() => Int)
	itemPrice: number;

	@IsNotEmpty()
	@Field(() => String)
	providerId: string;

	@Field(() => AddressInput)
	address: AddressInput;

	order?: ObjectId;

	memberId?: ObjectId;
}

@InputType()
class ORsearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: string;

	@IsOptional()
	@Field(() => OrderStatus, { nullable: true })
	orderStatus?: OrderStatus;
}

@InputType()
export class OrderInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableOrdersSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	directions?: Direction;

	@IsOptional()
	@Field(() => ORsearch, { nullable: true })
	search?: ORsearch;
}

/** ADMIN  **/

@InputType()
class ORSsearch {
	@IsNotEmpty()
	@Field(() => String, { nullable: true })
	text?: string;

	@IsNotEmpty()
	@Field(() => String, { nullable: true })
	orderStatus?: OrderStatus;

	@IsNotEmpty()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;
}

@InputType()
export class OrdersInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn([availableOrdersSorts])
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	directions?: Direction;

	@IsNotEmpty()
	@Field(() => ORSsearch)
	search: ORSsearch;
}
