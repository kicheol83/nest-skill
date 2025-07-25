import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
	ProviderLevel,
	ProviderLocation,
	ProviderRateType,
	ProviderStatus,
	ProviderType,
	ProviderWeekday,
	ProviderWorkWeekday,
} from '../../enums/provider.enum';
import { ObjectId } from 'mongoose';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';

@ObjectType()
export class ProviderPost {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => ProviderType)
	providerType: ProviderType;

	@Field(() => ProviderStatus)
	providerStatus: ProviderStatus;

	@Field(() => ProviderLocation)
	providerLocation: ProviderLocation;

	@Field(() => ProviderLevel)
	providerLevel: ProviderLevel;

	@Field(() => ProviderWorkWeekday)
	providerWorkWeekday: ProviderWorkWeekday;

	@Field(() => [ProviderWeekday])
	providerWeekday: ProviderWeekday[];

	@Field(() => ProviderRateType)
	providerRateType: ProviderRateType;

	@Field(() => Int)
	providerWorkDayLimit: number;

	@Field(() => String)
	providerStartTime: string;

	@Field(() => String)
	providerEndTime: string;

	@Field(() => String)
	providerAddress: string;

	@Field(() => String)
	providerTitle: string;

	@Field(() => Int)
	providerWorkPrice: number;

	@Field(() => Int)
	providerViews: number;

	@Field(() => Int)
	providerLikes: number;

	@Field(() => Int)
	providerComments: number;

	@Field(() => Int)
	providerRank: number;

	@Field(() => [String])
	providerImages: string[];

	@Field(() => String, { nullable: true })
	providerDesc?: string;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date, { nullable: true })
	deletedAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/
	@Field(() => Member, { nullable: true })
	memberData?: Member;

	@Field(() => [MeLiked], { nullable: true })
	meLiked?: MeLiked[];
}

@ObjectType()
export class ProviderPosts {
	@Field(() => [ProviderPost])
	list: ProviderPost[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];

	@Field(() => [String])
	text?: string[];
}
