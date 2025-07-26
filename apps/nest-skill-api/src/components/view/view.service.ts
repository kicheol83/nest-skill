import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ViewInput } from '../../libs/dto/view/view.input';
import { View } from '../../libs/dto/view/view';
import { T } from '../../libs/types/common';
import { Model, ObjectId } from 'mongoose';
import { lookupVisit } from '../../libs/config';
import { OrdinaryInquiry } from '../../libs/dto/provider-post/provider-post.input';
import { ProviderPosts } from '../../libs/dto/provider-post/provider-post';
import { ViewGroup } from '../../libs/enums/view.enum';

@Injectable()
export class ViewService {
	constructor(@InjectModel('View') private readonly viewModel: Model<View>) {}

	public async recordView(input: ViewInput): Promise<View | null> {
		const viewExist = await this.checkViewExistence(input);
		if (!viewExist) {
			console.log('-- New View Insert --');
			return await this.viewModel.create(input);
		} else return null;
	}

	private async checkViewExistence(input: ViewInput): Promise<View> {
		const { memberId, viewRefId } = input;
		const search: T = { memberId: memberId, viewRefId: viewRefId };
		return await this.viewModel.findOne(search).exec();
	}

	public async getVisitedProperties(memberId: ObjectId, input: OrdinaryInquiry): Promise<ProviderPosts> {
		const { page, limit } = input;
		const match: T = { viewGroup: ViewGroup.PROVIDER, memberId: memberId };

		const data: T = await this.viewModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'provider',
						localField: 'viewRefId',
						foreignField: '_id',
						as: 'visitedProviderPost',
					},
				},
				{ $unwind: '$visitedProviderPost' },
				{
					$facet: {
						list: [
							{
								$skip: (page - 1) * limit,
							},
							{
								$limit: limit,
							},
							lookupVisit,
							{ $unwind: '$visitedProviderPost.memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		const result: ProviderPosts = { list: [], metaCounter: data[0].metaCounter };
		result.list = data[0].list.map((ele) => ele.visitedProviderPost);
		return result;
	}
}
