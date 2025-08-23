import { ObjectType, Field, Int } from '@nestjs/graphql';
import { OrderStatus } from '../../enums/order.enum';
import { ObjectId } from 'mongoose';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class OrderItem {
	@Field(() => String)
	_id: ObjectId;

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

@ObjectType()
export class Address {
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

@ObjectType()
export class Order {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => Int)
	orderPrice: number;

	@Field(() => Int)
	webTax: number;

	@Field(() => OrderStatus)
	orderStatus: OrderStatus;

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

	@Field(() => Address, { nullable: true })
	address?: Address;

	@Field(() => [OrderItem], { nullable: true })
	orderItems?: OrderItem[];
}

@ObjectType()
export class Orders {
	@Field(() => [Order])
	list: Order[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
