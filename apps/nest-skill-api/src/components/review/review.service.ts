import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { Review, Reviews } from '../../libs/dto/review-post/review';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { CreateReviewInput, ReviewInquiry } from '../../libs/dto/review-post/review.input';
import { Order, OrderItem } from '../../libs/dto/order/order';
import { OrderStatus } from '../../libs/enums/order.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { UpdateReviewInput } from '../../libs/dto/review-post/review.update';
import { T } from '../../libs/types/common';
import { lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../../libs/enums/notification.enum';

@Injectable()
export class ReviewService {
	constructor(
		@InjectModel('Review') private readonly reviewModel: Model<Review>,
		@InjectModel('OrderItems') private readonly orderItemModel: Model<OrderItem>,
		@InjectModel('Order') private readonly orderModel: Model<Order>,
		private memberService: MemberService,
		private readonly notificationService: NotificationService,
	) {}

	// review.service.ts
	public async createReview(memberId: ObjectId, input: CreateReviewInput): Promise<Review> {
		try {
			console.log('input =>', input);
			const orderItem = await this.orderItemModel
				.findById(input.orderItemId)
				.populate<{ orderId: Order }>('orderId')
				.exec();

			if (!orderItem || !orderItem.orderId) {
				throw new NotFoundException(Message.NO_DATA_FOUND);
			}

			const order = orderItem.orderId;
			if (order.orderStatus !== OrderStatus.COMPLETED) {
				throw new ForbiddenException(Message.YOU_NOT_UPDATE_ORDER);
			}
			if (order.memberId.toString() !== memberId.toString()) {
				throw new ForbiddenException(Message.REVIEW_UPDATE_YOUT_OWN_REVIEW);
			}
			const existingReview = await this.reviewModel.findOne({
				orderItemId: input.orderItemId,
			});
			if (existingReview) {
				throw new BadRequestException(Message.BAD_REQUEST);
			}

			const newReview = await this.reviewModel.create({
				...input,
				providerId: orderItem.providerId,
			});

			await this.notificationService.createNotification(memberId, {
				notificationType: NotificationType.REVIEW,
				notificationTitle: 'Succesfully Review created',
				notificationDesc: `Price: ${input.reviewComments}$`,
				senderId: memberId.toString(),
				receiverId: memberId.toString(),
				isRead: false,
			});

			return newReview;
		} catch (error) {
			console.error('Error creating review:', error);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async updateReview(memberId: ObjectId, input: UpdateReviewInput): Promise<Review> {
		const { _id } = input;

		const review = await this.reviewModel.findOne({ _id: _id });

		if (!review) {
			throw new NotFoundException(Message.NO_DATA_FOUND);
		}

		if (review.memberId.toString() !== memberId.toString()) {
			throw new ForbiddenException(Message.REVIEW_UPDATE_YOUT_OWN_REVIEW);
		}

		const result = await this.reviewModel.findOneAndUpdate({ _id: _id, memberId: memberId }, input, { new: true });
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	public async getReview(memberId: ObjectId, reviewId: ObjectId): Promise<Review> {
		const search: T = {
			_id: reviewId,
		};

		const targetReview: Review = await this.reviewModel.findOne(search).lean().exec();
		if (!targetReview) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		targetReview.memberData = await this.memberService.getMember(null, targetReview.memberId);
		return targetReview;
	}

	public async getReviews(reviewId: ObjectId, input: ReviewInquiry): Promise<Reviews> {
		const { text } = input.search;
		const match: T = {};
		const sort: T = { [input.sort ?? 'createdAt']: input?.directions ?? Direction.DESC };

		if (text) match.reviewComments = { $regex: new RegExp(text, 'i') };
		if (input.search?.memberId) {
			match.memberId = shapeIntoMongoObjectId(input.search.memberId);
		}
		console.log('match:', match);

		const result = await this.reviewModel
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

		return result[0];
	}

	public async deleteMyReview(memberId: ObjectId, reviewId: string): Promise<boolean> {
		const rvId = shapeIntoMongoObjectId(reviewId);
		const review = await this.reviewModel.findById(rvId);

		if (!review) {
			throw new NotFoundException(Message.NO_DATA_FOUND);
		}

		if (review.memberId?.toString() !== memberId.toString()) {
			throw new ForbiddenException(Message.REVIEW_UPDATE_YOUT_OWN_REVIEW);
		}

		await this.reviewModel.findByIdAndDelete(review._id);
		return true;
	}

	/** ROLES => ADMIN GRAPHql **/
	public async getAllReviewByAdmin(input: ReviewInquiry): Promise<Reviews> {
		const { text } = input.search;
		const match: T = {};
		const sort: T = { [input.sort ?? 'createdAt']: input?.directions ?? Direction.DESC };

		if (text) match.reviewComments = { $regex: new RegExp(text, 'i') };

		console.log('match:', match);

		const result = await this.reviewModel
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

		return result[0];
	}

	public async updateReviewByAdmin(input: UpdateReviewInput): Promise<Review> {
		const { _id } = input;

		const review = await this.reviewModel.findOne({ _id: _id });

		if (!review) {
			throw new NotFoundException(Message.NO_DATA_FOUND);
		}

		const result = await this.reviewModel.findOneAndUpdate({ _id: _id }, input, { new: true });
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	public async deleteReviewByAdmin(reviewId: string): Promise<Review> {
		const rvId = shapeIntoMongoObjectId(reviewId);
		const review = await this.reviewModel.findById(rvId);

		if (!review) {
			throw new NotFoundException(Message.NO_DATA_FOUND);
		}

		const result = await this.reviewModel.findByIdAndDelete(review._id);
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}
}
