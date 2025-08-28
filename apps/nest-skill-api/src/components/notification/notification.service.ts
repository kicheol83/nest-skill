import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Notification } from '../../libs/dto/notification/notification';
import { MemberService } from '../member/member.service';
import { NotificationInput, NotificationInquiry } from '../../libs/dto/notification/notification.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { NotificationUpdate } from '../../libs/dto/notification/notification.update';
import { T } from '../../libs/types/common';
import { lookupMember } from '../../libs/config';

@Injectable()
export class NotificationService {
	constructor(
		@InjectModel('Notifications') private readonly notificationModel: Model<Notification>,
		private memberService: MemberService,
	) {}

	public async createNotification(memberId: ObjectId, input: NotificationInput): Promise<Notification> {
		try {
			const notification = new this.notificationModel({
				...input,
				receiverId: memberId,
				senderId: input.senderId ? input.senderId : null,
			});

			const result = await notification.save();
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
		const match: T = { receiverId: memberId };

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
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}
}
