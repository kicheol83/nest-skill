import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { NoticeCategory, NoticeStatus } from '../../enums/notice.enum';

@ObjectType()
export class Notice {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => NoticeCategory)
	noticeCategory: NoticeCategory;

	@Field(() => NoticeStatus)
	noticeStatus: NoticeStatus;

	@Field(() => String)
	noticeTitle: string;

	@Field(() => String)
	noticeContent: string;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}
