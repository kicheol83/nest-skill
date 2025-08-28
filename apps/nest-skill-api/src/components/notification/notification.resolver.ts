import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification, Notifications } from '../../libs/dto/notification/notification';
import { NotificationInput, NotificationInquiry } from '../../libs/dto/notification/notification.input';
import { NotificationUpdate } from '../../libs/dto/notification/notification.update';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class NotificationResolver {
	constructor(private readonly notificationService: NotificationService) {}

	@UseGuards(AuthGuard)
	@Mutation(() => Notification)
	public async createNotification(@Args('input') input: NotificationInput, @AuthMember('_id') memberId: ObjectId) {
		console.log('Mutation: createNotification');
		return this.notificationService.createNotification(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query(() => Notification, { nullable: true })
	public async getNotification(@Args('id') id: string, @AuthMember('_id') memberId: ObjectId) {
		console.log('Query: getNotification');
		return this.notificationService.getNotification(memberId, id);
	}

	@UseGuards(AuthGuard)
	@Query(() => Notifications)
	public async getNotifications(@Args('inquiry') inquiry: NotificationInquiry, @AuthMember('_id') memberId: ObjectId) {
		console.log('Query: getNotifications');
		return this.notificationService.getNotifications(memberId, inquiry);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Notification, { nullable: true })
	public async updateNotification(@Args('input') input: NotificationUpdate, @AuthMember('_id') memberId: ObjectId) {
		console.log('Mutation: updateNotification');
		input._id = shapeIntoMongoObjectId(input._id);
		return this.notificationService.updateNotification(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Boolean)
	public async deleteNotification(@Args('id') id: string, @AuthMember('_id') memberId: ObjectId) {
		console.log('Mutation: updateNotification');
		id = shapeIntoMongoObjectId(id);
		const result = await this.notificationService.deleteNotification(memberId, id);
		return result;
	}
}
