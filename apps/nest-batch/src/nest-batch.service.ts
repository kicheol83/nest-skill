import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from 'apps/nest-skill-api/src/libs/dto/member/member';
import { ProviderPost } from 'apps/nest-skill-api/src/libs/dto/provider-post/provider-post';
import { MemberStatus, MemberType } from 'apps/nest-skill-api/src/libs/enums/member.enum';
import { ProviderStatus } from 'apps/nest-skill-api/src/libs/enums/provider.enum';
import { Model } from 'mongoose';

@Injectable()
export class NestBatchService {
	constructor(
		@InjectModel('Provider') private readonly providerModel: Model<ProviderPost>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
	) {}

	public async batchRollback(): Promise<void> {
		console.log('batchRollback');
		await this.providerModel.updateMany({ propertyStatus: ProviderStatus.ACTIVE }, { propertyRank: 0 }).exec();

		await this.memberModel
			.updateMany({ memberStatus: MemberStatus.ACTIVE, memberType: MemberType.PROVIDER }, { memberRank: 0 })
			.exec();
	}

	public async batchTopProperties(): Promise<void> {
		console.log('batchProperties');
		const properties: ProviderPost[] = await this.providerModel
			.find({
				propertyStatus: ProviderStatus.ACTIVE,
				propertyRank: 0,
			})
			.exec();

		const promisedList = properties.map(async (ele: ProviderPost) => {
			const { _id, providerLikes, providerViews } = ele;
			const rank = providerLikes * 2 + providerViews * 1;
			return await this.providerModel.findByIdAndUpdate(_id, { propertyRank: rank });
		});
		await Promise.all(promisedList);
	}

	public async batchTopAgents(): Promise<void> {
		console.log('batchAgents');
		const agents: Member[] = await this.memberModel
			.find({
				memberType: MemberType.PROVIDER,
				memberStatus: MemberStatus.ACTIVE,
				memberRank: 0,
			})
			.exec();

		const promisedList = agents.map(async (ele: Member) => {
			const { _id, memberJobs, memberLikes, memberArticles, memberViews } = ele;
			const rank = memberJobs * 5 + memberArticles * 3 + memberLikes * 2 + memberViews * 1;
			return await this.memberModel.findOneAndUpdate(_id, { memberRank: rank });
		});
		await Promise.all(promisedList);
	}

	getHello(): string {
		return 'Welcome to Nest Skill BATCH server!';
	}
}
