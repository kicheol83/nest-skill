import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { PaymentMethod, PaymentStatus } from '../../enums/payment.enum';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class Payment {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => Int)
	paymentAmount: number;

	@Field(() => PaymentStatus)
	paymentStatus: PaymentStatus;

	@Field(() => PaymentMethod)
	paymentMethod: PaymentMethod;

	@Field(() => String, { nullable: true })
	transactionId?: string;

	@Field(() => String)
	orderId: string;

	@Field(() => String)
	memberId: string;

	@Field(() => Date)
	createdAt: Date;

	/** from aggregation **/
	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Payments {
	@Field(() => [Payment])
	list: Payment[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
