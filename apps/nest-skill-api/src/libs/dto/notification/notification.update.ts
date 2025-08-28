import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ObjectId } from 'mongoose';
import { NotificationType } from '../../enums/notification.enum';

@InputType()
export class NotificationUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => NotificationType, { nullable: true })
	notificationType?: NotificationType;

	@IsOptional()
	@Length(1, 100)
	@Field(() => String, { nullable: true })
	notificationTitle?: string;

	@IsOptional()
	@Length(1, 100)
	@Field(() => String, { nullable: true })
	notificationDesc?: string;
}
