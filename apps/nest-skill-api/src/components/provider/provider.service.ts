import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProviderPost } from '../../libs/dto/provider/provider';
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MemberService } from '../member/member.service';
import { Message } from '../../libs/enums/common.enum';
import { ProviderPostInput } from '../../libs/dto/provider/provider.input';
import { CREATE_JOB_LIMIT } from '../../libs/config';
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
}
