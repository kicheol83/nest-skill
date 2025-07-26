import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { Member, TotalCounter } from '../member/member';

@ObjectType()
export class Review {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => Int)
	reviewRating: number;

	@Field(() => String, { nullable: true })
	reviewComments?: string;

	@Field(() => [String], { nullable: true })
	reviewImages?: string[];

	@Field(() => String)
	orderItemId: string;

	@Field(() => String)
	providerId: string;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/

	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Reviews {
	@Field(() => [Review])
	list: Review[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
