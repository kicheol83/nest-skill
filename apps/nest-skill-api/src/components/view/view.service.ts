import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ViewInput } from '../../libs/dto/view/view.input';
import { View } from '../../libs/dto/view/view';
import { T } from '../../libs/types/common';
import { Model } from 'mongoose';

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
}
