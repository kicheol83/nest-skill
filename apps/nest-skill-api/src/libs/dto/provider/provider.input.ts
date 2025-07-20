import { Field, InputType, Int } from '@nestjs/graphql';
import {
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsIn,
	IsInt,
	IsNotEmpty,
	IsOptional,
	Length,
	Matches,
	Min,
	ValidateIf,
} from 'class-validator';
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
import { Direction } from '../../enums/common.enum';
import { availableDayLimit, availableProviderPostSorts } from '../../config';

@InputType()
export class ProviderPostInput {
	@IsNotEmpty()
	@Field(() => ProviderType)
	providerType: ProviderType;

	@IsNotEmpty()
	@Field(() => ProviderLocation)
	providerLocation: ProviderLocation;

	@IsNotEmpty()
	@Field(() => ProviderWorkWeekday)
	providerWorkWeekday: ProviderWorkWeekday;

	@Field(() => [ProviderWeekday], { nullable: true })
	@ValidateIf((o) => o.providerWorkWeekday === 'CUSTOM')
	@IsArray()
	@ArrayNotEmpty()
	@IsEnum(ProviderWeekday, { each: true })
	providerWeekday?: ProviderWeekday[];

	@IsNotEmpty()
	@Field(() => ProviderRateType)
	providerRateType: ProviderRateType;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int, { defaultValue: 7 })
	providerWorkDayLimit: number;

	@IsNotEmpty()
	@Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
		message: 'Time must be in HH:mm format (e.g., 06:00)',
	})
	@Field(() => String)
	providerStartTime: string;

	@IsNotEmpty()
	@Field(() => String)
	@Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
		message: 'Time must be in HH:mm format (e.g., 06:00)',
	})
	providerEndTime: string;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	providerAddress: string;

	@IsNotEmpty()
	@Length(3, 50)
	@Field(() => String)
	providerTitle: string;

	@IsInt()
	@Field(() => Int)
	providerWorkPrice: number;

	@IsNotEmpty()
	@Field(() => [String])
	providerImages: string[];

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	providerDesc?: string;

	memberId?: ObjectId;
}

/** PROVIDER JOB POST SORTS **/
@InputType()
export class WorkTime {
	@Field(() => Int)
	start: string;

	@Field(() => Int)
	end: string;
}

@InputType()
export class WorkPrice {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
class PISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@IsOptional()
	@Field(() => [ProviderLocation], { nullable: true })
	locationList?: ProviderLocation[];

	@IsOptional()
	@Field(() => [ProviderType], { nullable: true })
	typeList?: ProviderType[];

	@IsOptional()
	@Field(() => [ProviderLevel], { nullable: true })
	levelList?: ProviderLevel[];

	@IsOptional()
	@Field(() => [ProviderWorkWeekday], { nullable: true })
	workWeekdayList?: ProviderWorkWeekday[];

	@IsOptional()
	@Field(() => [ProviderWeekday], { nullable: true })
	weekList?: ProviderWeekday[];

	@IsOptional()
	@Field(() => [ProviderRateType], { nullable: true })
	rateRangeList?: ProviderRateType[];

	@IsOptional()
	@IsIn(availableDayLimit, { each: true })
	@Field(() => [String], { nullable: true })
	options?: string[];

	@IsOptional()
	@Field(() => WorkTime, { nullable: true })
	workTimeRange?: WorkTime;

	@IsOptional()
	@Field(() => WorkPrice, { nullable: true })
	workPrice?: WorkPrice;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class ProviderJobsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableProviderPostSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	directions?: Direction;

	@IsNotEmpty()
	@Field(() => PISearch)
	search: PISearch;
}

@InputType()
class APISearch {
	@IsOptional()
	@Field(() => ProviderStatus, { nullable: true })
	providerStatus?: ProviderStatus;
}

@InputType()
export class ProviderMemberInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableProviderPostSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	directions?: Direction;

	@IsNotEmpty()
	@Field(() => APISearch)
	search: APISearch;
}

/** ADMIN **/
@InputType()
class ALPISearch {
	@IsOptional()
	@Field(() => ProviderStatus, { nullable: true })
	providerStatus?: ProviderStatus;

	@IsOptional()
	@Field(() => [ProviderLocation], { nullable: true })
	providerLocationList?: ProviderLocation[];
}

@InputType()
export class AllProviderJobsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableProviderPostSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	directions?: Direction;

	@IsNotEmpty()
	@Field(() => ALPISearch)
	search: ALPISearch;
}
