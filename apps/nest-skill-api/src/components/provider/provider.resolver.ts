import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from '../auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProviderPost } from '../../libs/dto/provider/provider';
import { ProviderPostInput } from '../../libs/dto/provider/provider.input';
import { ProviderService } from './provider.service';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { ProviderPostUpdate } from '../../libs/dto/provider/provider.update';

@Resolver()
export class ProviderResolver {
	constructor(private readonly providerService: ProviderService) {}

	@Roles(MemberType.PROVIDER)
	@UseGuards(RolesGuard)
	@Mutation(() => ProviderPost)
	public async createProvider(
		@Args('input') input: ProviderPostInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ProviderPost> {
		console.log('Mutation: createProvider');
		input.memberId = memberId;
		return await this.providerService.createProvider(input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => ProviderPost)
	public async getProvider(
		@Args('providerId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ProviderPost> {
		console.log('Query: getProvider');
		const providerId = shapeIntoMongoObjectId(input);
		return await this.providerService.getProvider(memberId, providerId);
	}

	@Roles(MemberType.PROVIDER)
	@UseGuards(RolesGuard)
	@Mutation((returns) => ProviderPost)
	public async updateProviderPost(
		@Args('input') input: ProviderPostUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ProviderPost> {
		console.log('Mutation: updateProviderPost');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.providerService.updateProviderPost(memberId, input);
	}
}
