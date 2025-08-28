import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { NotificationType } from '../../enums/notification.enum';
import { ObjectId } from 'mongoose';
import { Direction } from '../../enums/common.enum';
import { availableNotificationSorts } from '../../config';

@InputType()
export class NotificationInput {
	@IsNotEmpty()
	@Field(() => NotificationType)
	notificationType: NotificationType;

	@IsNotEmpty()
	@Length(1, 100)
	@Field(() => String)
	notificationTitle: string;

	@Length(1, 100)
	@Field(() => String)
	notificationDesc: string;

	@Field(() => Boolean)
	isRead: false;

	senderId: string;

	receiverId: string;
}

@InputType()
class NOTIFIearch {
	@IsOptional()
	@Field(() => NotificationType, { nullable: true })
	notificationType?: NotificationType;

	@IsOptional()
	@Field(() => String, { nullable: true })
	notificationTitle?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	notificationDesc?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	senderId?: ObjectId;
}

@InputType()
export class NotificationInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableNotificationSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	directions?: Direction;

	@IsNotEmpty()
	@Field(() => NOTIFIearch)
	search?: NOTIFIearch;
}
