import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';
import { Field, InputType, Int } from '@nestjs/graphql';
import { Direction } from '../../enums/common.enum';
import { availableNoticeSorts } from '../../config';
import { ObjectId } from 'mongoose';

@InputType()
export class CreateNotice {
	@IsNotEmpty()
	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@IsNotEmpty()
	@Length(1, 100)
	@Field(() => String)
	noticeTitle: string;

	@IsNotEmpty()
	@Length(1, 100)
	@Field(() => String)
	noticeContent: string;

	memberId?: string;
}

@InputType()
class NOTearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	noticeTitle?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	noticeContent?: string;

	@IsOptional()
	@Field(() => [NoticeCategory], { nullable: true })
	noticeCategory?: NoticeCategory[];

	@IsOptional()
	@Field(() => [NoticeStatus], { nullable: true })
	noticeStatus?: NoticeStatus[];

	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;
}

@InputType()
export class NoticeInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableNoticeSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	directions?: Direction;

	@IsNotEmpty()
	@Field(() => NOTearch)
	search: NOTearch;
}
