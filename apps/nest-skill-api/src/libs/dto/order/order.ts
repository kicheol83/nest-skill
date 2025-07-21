import { ObjectType, Field, Int } from '@nestjs/graphql';
import { OrderStatus } from '../../enums/order.enum';
import { ObjectId } from 'mongoose';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class Order {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => Int)
	orderPrice: number;

	@Field(() => Int)
	webTax: number;

	@Field(() => OrderStatus)
	orderStatus: OrderStatus.PENDING;

	@Field(() => Int)
	totalPrice: number;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Orders {
	@Field(() => [Order])
	list: Order[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}

@ObjectType()
export class OrderItem {
	@Field(() => Int)
	itemPrice: number;

	@Field(() => String)
	orderId: ObjectId;

	@Field(() => String)
	providerId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}
