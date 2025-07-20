import { Field, InputType, Int } from '@nestjs/graphql';
import {
	ArrayNotEmpty,
	IsArray,
	IsEnum,
	IsInt,
	IsNotEmpty,
	IsOptional,
	Length,
	Matches,
	Min,
	ValidateIf,
} from 'class-validator';
import {
	ProviderLocation,
	ProviderRateType,
	ProviderType,
	ProviderWeekday,
	ProviderWorkWeekday,
} from '../../enums/provider.enum';
import { ObjectId } from 'mongoose';

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
