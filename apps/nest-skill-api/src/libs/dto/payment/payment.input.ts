import { Field, InputType, Int } from '@nestjs/graphql';
import { PaymentMethod, PaymentStatus } from '../../enums/payment.enum';
import { IsIn, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { availablePaymentSorts } from '../../config';
import { Direction } from '../../enums/common.enum';

@InputType()
export class CreatePaymentInput {
	@Field(() => Int)
	paymentAmount: number;

	@Field(() => PaymentMethod)
	paymentMethod: PaymentMethod;

	@Field(() => String)
	orderId: string;

	memberId?: string;
}

@InputType()
class ORDsearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;

	@IsOptional()
	@Field(() => PaymentStatus, { nullable: true })
	paymentStatus?: PaymentStatus;

	@IsOptional()
	@Field(() => PaymentMethod, { nullable: true })
	paymentMethod?: PaymentMethod;
}

@InputType()
export class PaymentInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availablePaymentSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	directions?: Direction;

	@IsOptional()
	@Field(() => ORDsearch, { nullable: true })
	search?: ORDsearch;
}

@InputType()
class ORDAsearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;

	@IsOptional()
	@Field(() => PaymentStatus, { nullable: true })
	paymentStatus?: PaymentStatus;

	@IsOptional()
	@Field(() => PaymentMethod, { nullable: true })
	paymentMethod?: PaymentMethod;
}

@InputType()
export class AllPaymentsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availablePaymentSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	directions?: Direction;

	@IsOptional()
	@Field(() => ORDAsearch, { nullable: true })
	search?: ORDAsearch;
}
