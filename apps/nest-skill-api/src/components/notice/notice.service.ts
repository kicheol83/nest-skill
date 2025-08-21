import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notice, Notices } from '../../libs/dto/notice/notice';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { CreateNotice, NoticeInquiry } from '../../libs/dto/notice/notice-input';
import { NoticeUpdate } from '../../libs/dto/notice/notice-update';
import { NoticeStatus } from '../../libs/enums/notice.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';
import { lookupMember } from '../../libs/config';

@Injectable()
export class NoticeService {
	constructor(
		@InjectModel('Notices') private readonly noticeModel: Model<Notice>,
		private memberService: MemberService,
	) {}

	public async getActiveNotices(memberId: ObjectId, input: NoticeInquiry): Promise<Notices> {
		const { search } = input;
		const match: T = {};
		const sort: T = { [input.sort ?? 'createdAt']: input?.directions ?? Direction.DESC };

		if (search.noticeTitle) match.noticeTitle = { $regex: search.noticeTitle, $options: 'i' };
		if (search.noticeContent) match.noticeContent = { $regex: search.noticeContent, $options: 'i' };
		if (search.noticeCategory) match.noticeCategory = { $in: search.noticeCategory };
		if (search.noticeStatus) match.noticeStatus = { $in: search.noticeStatus };
		if (search.memberId) match.memberId = search.memberId;

		const result = await this.noticeModel
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

	public async getNoticeByIdForUser(memberId: ObjectId, _id: string): Promise<Notice> {
		const notice = await this.noticeModel.findOne({ _id, noticeStatus: 'ACTIVE' });
		if (!notice) throw new NotFoundException('Notice not found or not active');
		return notice;
	}

	public async createNotice(memberId: ObjectId, input: CreateNotice): Promise<Notice> {
		input.memberId = memberId.toString();
		try {
			const notice = this.noticeModel.create(input);
			return notice;
		} catch (err) {
			console.log('Error, noticeModel:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async updateNotice(memberId: ObjectId, input: NoticeUpdate): Promise<Notice> {
		const { _id } = input;
		const notice = await this.noticeModel.findOne({ _id: _id });

		if (!notice) {
			throw new NotFoundException(Message.NOTICE_NOT_FOUN);
		}

		const result = await this.noticeModel.findOneAndUpdate(
			{ _id: _id, memberId: memberId, noticeStatus: NoticeStatus.ACTIVE },
			input,
			{ new: true },
		);
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	public async deleteNotice(memberId: ObjectId, _id: string): Promise<boolean> {
		const notice = await this.noticeModel.findById(_id);
		if (!notice) throw new NotFoundException(Message.NOTICE_NOT_FOUN);

		notice.noticeStatus = NoticeStatus.DELETE;
		await notice.save();
		return true;
	}

	public async getNoticesForAdmin(memberId: ObjectId, input: NoticeInquiry): Promise<Notices> {
		const { search } = input;
		const sort: T = { [input.sort ?? 'createdAt']: input?.directions ?? Direction.DESC };
		const match: T = {};

		if (search.noticeTitle) match.noticeTitle = { $regex: search.noticeTitle, $options: 'i' };
		if (search.noticeContent) match.noticeContent = { $regex: search.noticeContent, $options: 'i' };
		if (search.noticeCategory) match.noticeCategory = { $in: search.noticeCategory };
		if (search.noticeStatus) match.noticeStatus = { $in: search.noticeStatus };
		if (search.memberId) match.memberId = search.memberId;

		const result = await this.noticeModel
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

	public async getNoticeById(_id: string): Promise<Notice> {
		const result = await this.noticeModel.findById(_id);
		if (!result) throw new NotFoundException(Message.NOTICE_NOT_FOUN);
		return result;
	}
}
