import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ObjectId } from 'mongoose';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

@InputType()
export class NoticeUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => NoticeCategory, { nullable: true })
	commentStatus?: NoticeCategory;

	@IsOptional()
	@Field(() => NoticeStatus, { nullable: true })
	noticeStatus?: NoticeStatus;

	@IsOptional()
	@Length(1, 100)
	@Field(() => String, { nullable: true })
	noticeTitle?: string;

	@IsOptional()
	@Length(1, 100)
	@Field(() => String, { nullable: true })
	noticeContent?: string;
}
