import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { MemberService } from '../member/member.service';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class OrderService {
	constructor(
		@InjectModel('Order') private readonly orderModel: Model<void>,
		private readonly memberService: MemberService,
	) {}
}
