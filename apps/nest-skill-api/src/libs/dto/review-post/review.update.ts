import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, Min, Max } from 'class-validator';

@InputType()
export class UpdateReviewInput {
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
