import { Injectable } from '@nestjs/common';
import { Payment } from '../../libs/dto/payment/payment';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MemberService } from '../member/member.service';

@Injectable()
export class PaymentService {
	constructor(
		@InjectModel('Payment') private readonly orderModel: Model<Payment>,

		private readonly memberService: MemberService,
	) {}
}
