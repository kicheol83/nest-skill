import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, Min, Max, IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

@InputType()
export class UpdateReviewInput {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Min(1)
	@Max(5)
	@Field(() => Int, { nullable: true })
	reviewRating?: number;

	@IsOptional()
	@Field(() => String, { nullable: true })
	reviewComments?: string;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	reviewImages?: string[];
}
