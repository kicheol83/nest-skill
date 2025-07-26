import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Min, Max, IsIn } from 'class-validator';
import { availableReviewSorts } from '../../config';
import { Direction } from '../../enums/common.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class CreateReviewInput {
	@IsNotEmpty()
	@Min(1)
	@Max(5)
	@Field(() => Int)
	reviewRating: number;

	@IsOptional()
	@Field(() => String, { nullable: true })
	reviewComments?: string;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	reviewImages?: string[];

	@IsOptional()
	@Field(() => String, { nullable: true })
	providerId?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	orderItemId?: string;
	memberId?: ObjectId;
}

@InputType()
class RSearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	reviewComments?: string;
}

@InputType()
export class ReviewInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableReviewSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	directions?: Direction;

	@IsNotEmpty()
	@Field(() => RSearch)
	search: RSearch;
}
