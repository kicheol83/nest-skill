import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Payment, Payments } from '../../libs/dto/payment/payment';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { CreatePaymentInput, PaymentInquiry } from '../../libs/dto/payment/payment.input';
import { PaymentStatus } from '../../libs/enums/payment.enum';
import { UpdatePaymentInput } from '../../libs/dto/payment/payment.update';
import { lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { Order } from '../../libs/dto/order/order';

@Injectable()
export class PaymentService {
	constructor(
		@InjectModel('Payment') private readonly paymentModel: Model<Payment>,
		@InjectModel('Order') private readonly orderModel: Model<Order>,

		private readonly memberService: MemberService,
	) {}

	public async createPayment(input: CreatePaymentInput, memberId: ObjectId): Promise<Payment> {
		const order = await this.orderModel.findById(input.orderId);
		if (!order) {
			throw new BadRequestException(Message.BAD_REQUEST);
		}
		if (order.memberId.toString() !== memberId.toString()) {
			throw new BadRequestException(Message.YOU_THIS_ORDER_NO_PAYMET);
		}
		try {
			const result = await this.paymentModel.create({
				...input,
				memberId,
				transactionId: `TX${Math.floor(Math.random() * 1000000000)}`,
				paymentStatus: PaymentStatus.PAID, // Fake success
			});

			return result;
		} catch (err) {
			console.log('Error in paymentModel:', err.message);
			throw new BadRequestException('Payment creation failed');
		}
	}

	public async getPayment(memberId: ObjectId, paymentId: string): Promise<Payment> {
		const id = shapeIntoMongoObjectId(paymentId);

		const result = await this.paymentModel.findOne({
			_id: id,
			memberId: memberId,
		});

		if (!result) throw new NotFoundException(Message.PAYMENT_NOT_FOUND);
		return result;
	}

	public async getPayments(memberId: ObjectId, input: PaymentInquiry) {
		const match: any = { memberId };
		if (input.search?.paymentStatus) match.paymentStatus = input.search.paymentStatus;
		if (input.search?.paymentMethod) match.paymentMethod = input.search.paymentMethod;

		const sort: T = { [input.sort ?? 'createdAt']: input?.directions ?? Direction.DESC };

		console.log('match:', match);
		const result = await this.paymentModel.aggregate([
			{ $match: match },
			{ $sort: sort },
			{
				$facet: {
					list: [
						{ $skip: (input.page - 1) * input.limit },
						{ $limit: input.limit },
						lookupMember,
						{ $unwind: '$memberData' },
					],
					metaCounter: [{ $count: 'total' }],
				},
			},
		]);

		return result[0];
	}

	public async deletePayment(memberId: ObjectId, paymentId: string): Promise<boolean> {
		const payment = await this.paymentModel.findOne({ _id: shapeIntoMongoObjectId(paymentId), memberId });
		if (!payment) throw new NotFoundException(Message.PAYMENT_NOT_FOUND);

		payment.deletedAt = new Date();
		await payment.save();
		return true;
	}

	/** ADMIN **/
	async getPaymentsByAdmin(memberId: ObjectId, input: PaymentInquiry): Promise<Payments> {
		const match: any = {};

		if (input?.search?.paymentStatus) {
			match.paymentStatus = input.search.paymentStatus;
		} else {
			match.paymentStatus = { $in: Object.values(PaymentStatus) };
		}

		const sort: any = { [input.sort ?? 'createdAt']: input?.directions ?? Direction.DESC };

		console.log('match:', match);

		const result = await this.paymentModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		console.log('result =>', result);

		return result[0];
	}

	async getPaymentByAdmin(memberId: ObjectId, paymentId: ObjectId): Promise<Payment> {
		const result = await this.paymentModel.findById(paymentId);
		if (!result) throw new NotFoundException(Message.PAYMENT_NOT_FOUND);
		return result;
	}

	public async updatePayment(memberId: ObjectId, input: UpdatePaymentInput): Promise<Payment> {
		const payment = await this.paymentModel.findOne({ _id: input._id });
		if (!payment) throw new NotFoundException(Message.PAYMENT_NOT_FOUND);

		if (input.paymentMethod) payment.paymentMethod = input.paymentMethod;

		const result = await payment.save();
		return result;
	}

	async deletePaymentByAdmin(memberId: ObjectId, paymentId: ObjectId): Promise<boolean> {
		const result = await this.paymentModel.findByIdAndDelete(paymentId);
		return !!result;
	}
}
