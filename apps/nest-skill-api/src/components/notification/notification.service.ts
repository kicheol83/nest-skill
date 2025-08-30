import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Notification } from '../../libs/dto/notification/notification';
import { MemberService } from '../member/member.service';
import { NotificationInput, NotificationInquiry } from '../../libs/dto/notification/notification.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { NotificationUpdate } from '../../libs/dto/notification/notification.update';
import { T } from '../../libs/types/common';
import { lookupReceiver } from '../../libs/config';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class NotificationService {
	constructor(
		@InjectModel('Notifications') private readonly notificationModel: Model<Notification>,
		private memberService: MemberService,
		private redisService: RedisService,
	) {}

	public async createNotification(memberId: ObjectId, input: NotificationInput): Promise<Notification> {
		console.log('input =>', input);
		try {
			const notification = new this.notificationModel({
				...input,
				receiverId: input.receiverId,
				senderId: input.senderId ? input.senderId : null,
				isRead: false,
			});

			const result = await notification.save();
			await this.redisService.publish('notification', {
				receiverId: input.receiverId,
				...result.toObject(),
			});

			console.log('Notification saved:', result);

			return result;
		} catch (err) {
			console.log('ERROR: notificationModel', err);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getNotification(memberId: ObjectId, id: string): Promise<Notification> {
		const result = await this.notificationModel.findById(id);
		if (!result) throw new NotFoundException(Message.NO_DATA_FOUND);
		return result;
	}

	public async updateNotification(memberId: ObjectId, input: NotificationUpdate): Promise<Notification> {
		const { _id } = input;
		const notification = await this.notificationModel.findOne({ _id: _id });

		if (!notification) {
			throw new NotFoundException(Message.NO_DATA_FOUND);
		}

		const result = await this.notificationModel.findOneAndUpdate({ _id: _id, receiverId: memberId }, input, {
			new: true,
		});
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	public async deleteNotification(memberId: ObjectId, id: string): Promise<boolean> {
		const result = await this.notificationModel.findOneAndDelete({ _id: id, receiverId: memberId });
		if (!result) throw new NotFoundException(Message.NO_DATA_FOUND);
		return true;
	}

	public async getNotifications(memberId: ObjectId, input: NotificationInquiry) {
		const { search } = input;
		const sort: T = { [input.sort ?? 'createdAt']: input?.directions ?? Direction.DESC };
		const match: T = { receiverId: memberId, isRead: false };
		console.log('memberId type =>', typeof memberId, memberId);

		if (search) {
			if (search.notificationType) match.notificationType = search.notificationType;
			if (search.notificationTitle) match.notificationTitle = { $regex: search.notificationTitle, $options: 'i' };
			if (search.notificationDesc) match.notificationDesc = { $regex: search.notificationDesc, $options: 'i' };
		}

		const result = await this.notificationModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupReceiver,
							{ $unwind: '$receiverData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		console.log('result =>', result[0]);

		return result[0];
	}

	public async markAllAsRead(memberId: ObjectId): Promise<boolean> {
		try {
			await this.notificationModel.updateMany({ receiverId: memberId, isRead: false }, { $set: { isRead: true } });
			return true;
		} catch (err) {
			console.log('ERROR: markAllAsRead', err);
			throw new BadRequestException('Failed to mark all notifications as read');
		}
	}

	// NotificationService.ts
	public async markNotificationRead(memberId: ObjectId, notificationId: string): Promise<Notification> {
		try {
			const notification = await this.notificationModel.findOneAndUpdate(
				{ _id: notificationId, receiverId: memberId },
				{ $set: { isRead: true } },
				{ new: true },
			);

			if (!notification) {
				throw new NotFoundException('Notification not found or you do not have permission');
			}

			return notification;
		} catch (err) {
			console.log('ERROR: markNotificationRead', err);
			throw new BadRequestException('Failed to mark notification as read');
		}
	}
}
