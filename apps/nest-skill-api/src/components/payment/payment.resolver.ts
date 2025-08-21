import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Payment, Payments } from '../../libs/dto/payment/payment';
import { CreatePaymentInput, PaymentInquiry } from '../../libs/dto/payment/payment.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { UpdatePaymentInput } from '../../libs/dto/payment/payment.update';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class PaymentResolver {
	constructor(private readonly paymentService: PaymentService) {}

	@UseGuards(AuthGuard)
	@Mutation(() => Payment)
	public async createPayment(
		@Args('input') input: CreatePaymentInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Payment> {
		console.log('Mutation: createPayment');
		return await this.paymentService.createPayment(input, memberId);
	}

	@UseGuards(AuthGuard)
	@Query(() => Payment)
	public async getPayment(@Args('paymentId') paymentId: string, @AuthMember('_id') memberId: ObjectId) {
		console.log('Query: getPayment');
		return await this.paymentService.getPayment(memberId, paymentId);
	}

	@UseGuards(AuthGuard)
	@Query(() => Payments)
	public async getPayments(@Args('input') input: PaymentInquiry, @AuthMember('_id') memberId: ObjectId) {
		console.log('Query: getPayments');
		return await this.paymentService.getPayments(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Boolean)
	public async deletePayment(@Args('paymentId') paymentId: string, @AuthMember('_id') memberId: ObjectId) {
		console.log('Mutation: deletePayment');
		return await this.paymentService.deletePayment(memberId, paymentId);
	}

	/** ADMIN **/
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Payments)
	async getPaymentsByAdmin(@Args('input') input: PaymentInquiry, @AuthMember('_id') memberId: ObjectId) {
		console.log('Query: getPaymentsByAdmin');
		return await this.paymentService.getPaymentsByAdmin(memberId, input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Payment)
	async getPaymentByAdmin(@Args('paymentId') paymentId: string, @AuthMember('_id') memberId: ObjectId) {
		console.log('Query: getPaymentByAdmin');
		const id = shapeIntoMongoObjectId(paymentId);
		return await this.paymentService.getPaymentByAdmin(memberId, id);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Payment)
	public async updatePayment(@Args('input') input: UpdatePaymentInput, @AuthMember('_id') memberId: ObjectId) {
		console.log('Muatation: updatePayment');
		return await this.paymentService.updatePayment(memberId, input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Boolean)
	async deletePaymentByAdmin(@Args('paymentId') paymentId: string, @AuthMember('_id') memberId: ObjectId) {
		console.log('Mutation: deletePaymentByAdmin');
		const id = shapeIntoMongoObjectId(paymentId);
		return await this.paymentService.deletePaymentByAdmin(memberId, id);
	}
}
