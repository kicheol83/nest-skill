import { Injectable } from '@nestjs/common';
import { Review } from '../../libs/dto/review-post/review';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { OrderItem } from '../../libs/dto/order/order';

@Injectable()
export class ReviewService {
	constructor(
		@InjectModel('Review') private readonly reviewModel: Model<Review>,
		@InjectModel('OrderItems') private readonly orderItemModel: Model<OrderItem>,
		private memberService: MemberService,
	) {}
}
