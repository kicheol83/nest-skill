import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProviderPost, ProviderPosts } from '../../libs/dto/provider/provider';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MemberService } from '../member/member.service';
import { Direction, Message } from '../../libs/enums/common.enum';
import {
	AllProviderJobsInquiry,
	ProviderJobsInquiry,
	ProviderMemberInquiry,
	ProviderPostInput,
} from '../../libs/dto/provider/provider.input';
import { CREATE_JOB_LIMIT, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { ProviderStatus } from '../../libs/enums/provider.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { ViewService } from '../view/view.service';
import { ViewGroup } from '../../libs/enums/view.enum';
import * as moment from 'moment';
import { ProviderPostUpdate } from '../../libs/dto/provider/provider.update';

@Injectable()
export class ProviderService {
	constructor(
		@InjectModel('Provider') private readonly providerModel: Model<ProviderPost>,
		private memberService: MemberService,
		private viewService: ViewService,
	) {}

	public async createProvider(input: ProviderPostInput): Promise<ProviderPost> {
		try {
			const existingCount = await this.providerModel.countDocuments({ memberId: input.memberId });

			if (existingCount >= CREATE_JOB_LIMIT) {
				throw new BadRequestException(Message.YOU_CAN_ONLY_CREATE_UP_TO_3_PROVIDERS);
			}
			const result = await this.providerModel.create(input);
			await this.memberService.memberStatisEditor({
				_id: result.memberId,
				targetKey: 'memberJobs',
				modifier: 1,
			});
			return result;
		} catch (err) {
			console.log('Error, Service.model:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getProvider(memberId: ObjectId, providerId: ObjectId): Promise<ProviderPost> {
		const search: T = {
			_id: providerId,
			providerStatus: ProviderStatus.ACTIVE,
		};

		const targetProvider: ProviderPost = await this.providerModel.findOne(search).lean().exec();
		if (!targetProvider) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = { memberId: memberId, viewRefId: providerId, viewGroup: ViewGroup.PROVIDER };
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.providerStatsEditor({ _id: providerId, targetKey: 'providerViews', modifier: 1 });
				targetProvider.providerViews++;
			}

			// meLiked
		}

		targetProvider.memberData = await this.memberService.getMember(null, targetProvider.memberId);
		return targetProvider;
	}

	public async providerStatsEditor(input: StatisticModifier): Promise<ProviderPost> {
		const { _id, targetKey, modifier } = input;
		return await this.providerModel.findByIdAndUpdate(_id, { $inc: { [targetKey]: modifier } }, { new: true }).exec();
	}

	public async updateProviderPost(memberId: ObjectId, input: ProviderPostUpdate): Promise<ProviderPost> {
		let { providerStatus, deletedAt } = input;
		const search: T = {
			_id: input._id,
			providerStatus: ProviderStatus.ACTIVE,
		};

		if (providerStatus === ProviderStatus.DELETE) deletedAt = moment().toDate();

		const result = await this.providerModel.findOneAndUpdate(search, input, { new: true }).exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		if (deletedAt) {
			await this.memberService.memberStatisEditor({
				_id: memberId,
				targetKey: 'memberJobs',
				modifier: -1,
			});
		}
		// DATABASADAN OCHIRISH MANTIGINI QILISHIM KERAK

		return result;
	}

	public async getProviderJobs(memberId: ObjectId, input: ProviderJobsInquiry): Promise<ProviderPosts> {
		const match: T = { providerStatus: ProviderStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.directions ?? Direction.DESC };

		this.shapeMatchQuery(match, input);
		console.log('matchQuery:', match);

		const result = await this.providerModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							// meLiked
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

	private shapeMatchQuery(match: T, input: ProviderJobsInquiry): void {
		const {
			memberId,
			locationList,
			typeList,
			levelList,
			workWeekdayList,
			weekList,
			rateRangeList,
			options,
			workTimeRange,
			workPrice,
			text,
		} = input.search;

		if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);
		if (locationList && locationList.length) match.providerLocation = { $in: locationList };
		if (typeList && typeList.length) match.providerType = { $in: typeList };
		if (levelList && levelList.length) match.providerLevel = { $in: levelList };
		if (workWeekdayList && workWeekdayList.length) match.providerWorkWeekday = { $in: workWeekdayList };
		if (weekList && weekList.length) match.providerWeekday = { $in: weekList };
		if (rateRangeList && rateRangeList.length) match.providerRateType = { $in: rateRangeList };

		if (workTimeRange) {
			match.providerStartTime = { $gte: workTimeRange.start };
			match.providerEndTime = { $lte: workTimeRange.end };
		}

		if (workPrice) match.providerWorkPrice = { $gte: workPrice.start, $lte: workPrice.end };

		if (text) match.providerTitle = { $regex: new RegExp(text, 'i') };
		if (options) {
			match['$or'] = options.map((ele) => {
				return { [ele]: true };
			});
		}
	}

	public async getProviderMemberJobs(memberId: ObjectId, input: ProviderMemberInquiry): Promise<ProviderPosts> {
		const { providerStatus } = input.search;
		if (providerStatus === ProviderStatus.DELETE) {
			throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);
		}

		const match: T = {
			memberId: memberId,
			providerStatus: providerStatus ?? { $ne: ProviderStatus.DELETE },
		};

		const sort: T = {
			[input?.sort ?? 'createdAt']: input?.directions ?? Direction.DESC,
		};

		const result = await this.providerModel
			.aggregate([
				{
					$match: match,
				},
				{
					$sort: sort,
				},
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

		if (!result.length) {
			throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		}

		return result[0];
	}

	public async getAllProviderJobsByAdmin(input: AllProviderJobsInquiry): Promise<ProviderPosts> {
		const { providerStatus, providerLocationList } = input.search;
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.directions ?? Direction.DESC };

		if (providerStatus) match.providerStatus = providerStatus;
		if (providerLocationList) match.providerLocation = { $in: providerLocationList };

		const result = await this.providerModel
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

		if (!result.length) {
			throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		}

		return result[0];
	}

	public async updateProviderPostyByAdmin(input: ProviderPostUpdate): Promise<ProviderPost> {
		let { providerStatus, deletedAt } = input;

		const search = {
			_id: input._id,
			providerStatus: ProviderStatus.ACTIVE,
		};

		if (providerStatus === ProviderStatus.DELETE) deletedAt = moment().toDate();

		const result = await this.providerModel
			.findOneAndUpdate(search, input, {
				new: true,
			})
			.exec();

		if (!result) {
			throw new InternalServerErrorException(Message.UPDATE_FAILED);
		}

		if (deletedAt) {
			await this.memberService.memberStatisEditor({
				_id: result.memberId,
				targetKey: 'memberJobs',
				modifier: -1,
			});
		}

		return result;
	}

	public async removeProviderPostyByAdmin(providerId: ObjectId): Promise<ProviderPost> {
		const search: T = { _id: providerId, providerStatus: ProviderStatus.DELETE };
		const result = await this.providerModel.findOneAndDelete(search).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}
}
