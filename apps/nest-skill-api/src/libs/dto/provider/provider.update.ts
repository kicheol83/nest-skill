import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsEnum, IsNotEmpty, IsOptional, Length, Matches, Max, Min } from 'class-validator';
import { ObjectId } from 'mongoose';
import {
	ProviderLevel,
	ProviderLocation,
	ProviderRateType,
	ProviderStatus,
	ProviderType,
	ProviderWeekday,
	ProviderWorkWeekday,
} from '../../enums/provider.enum';

@InputType()
export class ProviderPostUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => ProviderType, { nullable: true })
	providerType?: ProviderType;

	@IsOptional()
	@Field(() => ProviderStatus, { nullable: true })
	providerStatus?: ProviderStatus;

	@IsOptional()
	@Field(() => ProviderLocation, { nullable: true })
	providerLocation?: ProviderLocation;

	@IsOptional()
	@Field(() => ProviderLevel, { nullable: true })
	providerLevel?: ProviderLevel;

	@IsOptional()
	@Field(() => ProviderWorkWeekday, { nullable: true })
	providerWorkWeekday?: ProviderWorkWeekday;

	@IsOptional()
	@IsArray()
	@IsEnum(ProviderWeekday, { each: true })
	@Field(() => [ProviderWeekday], { nullable: true })
	providerWeekday?: ProviderWeekday[];

	@IsOptional()
	@Field(() => ProviderRateType, { nullable: true })
	providerRateType?: ProviderRateType;

	@IsOptional()
	@Min(1)
	@Max(7)
	@Field(() => Int, { nullable: true })
	providerWorkDayLimit?: number;

	@IsOptional()
	@Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
		message: 'Time must be in HH:mm format (e.g., 06:00)',
	})
	@Field(() => String, { nullable: true })
	providerStartTime?: string;

	@IsOptional()
	@Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
		message: 'Time must be in HH:mm format (e.g., 06:00)',
	})
	@Field(() => String, { nullable: true })
	providerEndTime?: string;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	providerAddress?: string;

	@IsOptional()
	@Length(3, 50)
	@Field(() => String, { nullable: true })
	providerTitle?: string;

	@IsOptional()
	@Field(() => Int, { nullable: true })
	providerWorkPrice?: number;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	providerImages?: string[];

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	providerDesc?: string;

	deletedAt?: Date;
}
