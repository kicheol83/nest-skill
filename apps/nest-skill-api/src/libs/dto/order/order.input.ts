import { InputType, Field, Int } from '@nestjs/graphql';
import { IsIn, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Direction } from '../../enums/common.enum';
import { availableOrdersSorts } from '../../config';
import { OrderStatus } from '../../enums/order.enum';
@InputType()
export class CreateOrderInput {
	@IsInt()
	@Min(0)
	@Field(() => Int)
	itemPrice: number;

	@IsNotEmpty()
	@Field(() => String)
	providerId: string;

	orderId?: string;

	memberId?: string;
}

@InputType()
class ORsearch {
	@IsNotEmpty()
	@Field(() => String, { nullable: true })
	text?: string;

	@IsNotEmpty()
	@Field(() => String, { nullable: true })
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
	@IsIn([availableOrdersSorts])
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	directions?: Direction;

	@IsNotEmpty()
	@Field(() => ORsearch)
	search: ORsearch;
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
	memberId?: string;
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
