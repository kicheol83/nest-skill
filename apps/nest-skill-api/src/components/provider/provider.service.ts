import { BadRequestException, Injectable } from '@nestjs/common';
import { ProviderPost } from '../../libs/dto/provider/provider';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { MemberService } from '../member/member.service';
import { Message } from '../../libs/enums/common.enum';
import { ProviderPostInput } from '../../libs/dto/provider/provider.input';
import { CREATE_JOB_LIMIT } from '../../libs/config';

@Injectable()
export class ProviderService {
	constructor(
		@InjectModel('Provider') private readonly propertyModel: Model<ProviderPost>,
		private memberService: MemberService,
	) {}

	public async createProvider(input: ProviderPostInput): Promise<ProviderPost> {
		try {
			const existingCount = await this.propertyModel.countDocuments({ memberId: input.memberId });

			if (existingCount >= CREATE_JOB_LIMIT) {
				throw new BadRequestException(Message.YOU_CAN_ONLY_CREATE_UP_TO_3_PROVIDERS);
			}
			const result = await this.propertyModel.create(input);
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
}
