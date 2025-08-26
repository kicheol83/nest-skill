import { Field, ObjectType } from '@nestjs/graphql';
import { Member } from '../member/member';
import { ObjectId } from 'mongoose';

@ObjectType()
export class AllChat {
	@Field(() => String)
	_id: ObjectId;

	@Field()
	sender: string;

	@Field()
	message: string;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	memberId?: string;

	@Field(() => Member, { nullable: true })
	memberDate?: Member;
}
