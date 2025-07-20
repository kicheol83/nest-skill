import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { MemberAuthType, MemberStatus, MemberType } from '../../enums/member.enum';
import { Direction } from '../../enums/common.enum';
import { availableMembersSorts, availableProvidersUserSorts } from '../../config';

@InputType()
export class MemberInput {
	@IsNotEmpty()
	@Length(3, 12)
	@Field(() => String)
	memberNick: string;

	@IsNotEmpty()
	@Length(5, 12)
	@Field(() => String)
	memberPassword: string;

	@IsNotEmpty()
	@Field(() => String)
	memberPhone: string;

	@IsOptional()
	@Field(() => MemberType, { nullable: true })
	memberType?: MemberType;

	@IsOptional()
	@Field(() => MemberAuthType, { nullable: true })
	memberAuthType?: MemberAuthType;
}

@InputType()
export class LoginInput {
	@IsNotEmpty()
	@Length(3, 12)
	@Field(() => String)
	memberNick: string;

	@IsNotEmpty()
	@Length(5, 12)
	@Field(() => String)
	memberPassword: string;
}

@InputType()
class AIsearch {
	@IsNotEmpty()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class ProviderInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn([availableProvidersUserSorts])
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	directions?: Direction;

	@IsNotEmpty()
	@Field(() => AIsearch)
	search: AIsearch;
}

/** ADMIN MEMBERS **/
@InputType()
class MIsearch {
	@IsOptional()
	@Field(() => MemberStatus, { nullable: true })
	memberStatus?: MemberStatus;

	@IsOptional()
	@Field(() => MemberType, { nullable: true })
	memberType?: MemberType;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class MembersInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn([availableMembersSorts])
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	directions?: Direction;

	@IsNotEmpty()
	@Field(() => MIsearch)
	search: MIsearch;
}
