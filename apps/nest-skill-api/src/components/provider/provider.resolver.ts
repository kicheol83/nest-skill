import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Roles } from '../auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProviderPost } from '../../libs/dto/provider/provider';
import { ProviderPostInput } from '../../libs/dto/provider/provider.input';
import { ProviderService } from './provider.service';

@Resolver()
export class ProviderResolver {
	constructor(private readonly propertyService: ProviderService) {}

	@Roles(MemberType.PROVIDER)
	@UseGuards(RolesGuard)
	@Mutation(() => ProviderPost)
	public async createProvider(
		@Args('input') input: ProviderPostInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ProviderPost> {
		console.log('Mutation: createProvider');
		input.memberId = memberId;
		return await this.propertyService.createProvider(input);
	}
}
