import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Review, Reviews } from '../../libs/dto/review-post/review';
import { CreateReviewInput, DeleteReviewInput, ReviewInquiry } from '../../libs/dto/review-post/review.input';
import { ObjectId } from 'mongoose';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { UpdateReviewInput } from '../../libs/dto/review-post/review.update';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@Resolver()
export class ReviewResolver {
	constructor(private readonly reviewService: ReviewService) {}

	@UseGuards(AuthGuard)
	@Mutation(() => Review)
	public async createReview(
		@Args('input') input: CreateReviewInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Review> {
		console.log('Mutation: createReview');
		input.memberId = memberId;
		return await this.reviewService.createReview(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation((returns) => Review)
	public async updateReview(
		@Args('input') input: UpdateReviewInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Review> {
		console.log('Mutation: updateReview');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.reviewService.updateReview(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Review)
	public async getReview(
		@Args('reviewId') input: string, //
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Review> {
		console.log('Query: getReview');
		const reviewId = shapeIntoMongoObjectId(input);
		return await this.reviewService.getReview(memberId, reviewId);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Reviews)
	public async getReviews(
		@Args('input') input: ReviewInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Reviews> {
		console.log('Query: getReviews');
		return await this.reviewService.getReviews(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation((returns) => Boolean)
	public async deleteMyReview(
		@Args('_id') reviewId: string, //
		@AuthMember('_id') memberId: ObjectId,
	): Promise<boolean> {
		console.log('Query: deleteMyReview');
		return this.reviewService.deleteMyReview(memberId, reviewId);
	}

	/** ADMIN **/
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query((returns) => Reviews)
	public async getAllReviewByAdmin(
		@Args('input') input: ReviewInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Reviews> {
		console.log('Query: getAllReviewByAdmin');
		return await this.reviewService.getAllReviewByAdmin(input);
	}

	@UseGuards(AuthGuard)
	@Mutation((returns) => Review)
	public async updateReviewByAdmin(
		@Args('input') input: UpdateReviewInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Review> {
		console.log('Mutation: updateReviewByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.reviewService.updateReviewByAdmin(input);
	}

	@UseGuards(AuthGuard)
	@Mutation((returns) => Review)
	public async deleteReviewByAdmin(
		@Args('_id') reviewId: string, //
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Review> {
		console.log('Query: deleteReviewByAdmin');
		return this.reviewService.deleteReviewByAdmin(reviewId);
	}
}
