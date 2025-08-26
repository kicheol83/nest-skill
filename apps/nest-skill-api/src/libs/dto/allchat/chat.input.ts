import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';
import { ObjectId } from 'mongoose';

@InputType()
export class AllChatInput {
	@IsNotEmpty()
	@Field(() => String)
	sender: string;

	@IsNotEmpty()
	@Length(0, 250)
	@Field(() => String)
	message: string;

	memberId?: ObjectId;
}
