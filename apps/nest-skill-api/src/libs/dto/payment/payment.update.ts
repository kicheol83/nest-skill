import { InputType, Field } from '@nestjs/graphql';
import { PaymentMethod, PaymentStatus } from '../../enums/payment.enum';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';

@InputType()
export class UpdatePaymentInput {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => PaymentStatus, { nullable: true })
	paymentStatus?: PaymentStatus;

	@IsOptional()
	@Field(() => PaymentMethod, { nullable: true })
	paymentMethod?: PaymentMethod;

	@IsOptional()
	@Field(() => String, { nullable: true })
	transactionId?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	orderId?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: string;
}
