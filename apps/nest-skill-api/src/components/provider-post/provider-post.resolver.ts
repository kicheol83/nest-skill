import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { Roles } from '../auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberType } from '../../libs/enums/member.enum';
import { ProviderPost, ProviderPosts } from '../../libs/dto/provider-post/provider-post';
import {
	AllProviderJobsInquiry,
	OrdinaryInquiry,
	ProviderJobsInquiry,
	ProviderMemberInquiry,
	ProviderPostInput,
} from '../../libs/dto/provider-post/provider-post.input';
import { ObjectId } from 'mongoose';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { ProviderPostUpdate } from '../../libs/dto/provider-post/provider-post.update';
import { WithoutGuard } from '../auth/guards/without.guard';
import { ProviderPostService } from './provider-post.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@Resolver()
export class ProviderPostResolver {
	constructor(private readonly providerPostService: ProviderPostService) {}

	@Roles(MemberType.PROVIDER)
	@UseGuards(RolesGuard)
	@Mutation(() => ProviderPost)
	public async createProvider(
		@Args('input') input: ProviderPostInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ProviderPost> {
		console.log('Mutation: createProvider');
		input.memberId = memberId;
		return await this.providerPostService.createProvider(input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => ProviderPost)
	public async getProvider(
		@Args('providerId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ProviderPost> {
		console.log('Query: getProvider');
		const providerId = shapeIntoMongoObjectId(input);
		return await this.providerPostService.getProvider(memberId, providerId);
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
		return await this.providerPostService.updateProviderPost(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => ProviderPosts)
	public async getProviderJobs(
		@Args('input') input: ProviderJobsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ProviderPosts> {
		console.log('Query: getProviderJobs');
		return await this.providerPostService.getProviderJobs(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => ProviderPosts)
	public async getFavorites(
		@Args('input') input: OrdinaryInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ProviderPosts> {
		console.log('Query: getFavorites');
		return await this.providerPostService.getFavorites(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => ProviderPosts)
	public async getVisited(
		@Args('input') input: OrdinaryInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ProviderPosts> {
		console.log('Query: getVisited');
		return await this.providerPostService.getVisited(memberId, input);
	}

	@Roles(MemberType.PROVIDER)
	@UseGuards(RolesGuard)
	@Query((returns) => ProviderPosts)
	public async getProviderMemberJobs(
		@Args('input') input: ProviderMemberInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ProviderPosts> {
		console.log('Query: getProviderMemberJobs');
		return await this.providerPostService.getProviderMemberJobs(memberId, input);
	}

	/** LIKE **/

	@UseGuards(AuthGuard)
	@Mutation(() => ProviderPost)
	public async likeTargetProviderPost(
		@Args('_id') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ProviderPost> {
		console.log('Mutation: likeTargetProviderPost');
		const likeRefId = shapeIntoMongoObjectId(input);
		return await this.providerPostService.likeTargetProviderPost(memberId, likeRefId);
	}

	/** ADMIN **/
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query((retruns) => ProviderPosts)
	public async getAllProviderJobsByAdmin(
		@Args('input') input: AllProviderJobsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<ProviderPosts> {
		console.log('Query: getAllProviderJobsByAdmin');
		return await this.providerPostService.getAllProviderJobsByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((retruns) => ProviderPost)
	public async updateProviderPostyByAdmin(@Args('input') input: ProviderPostUpdate): Promise<ProviderPost> {
		console.log('Mutation: updateProviderPostyByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.providerPostService.updateProviderPostyByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => ProviderPost)
	public async removeProviderPostyByAdmin(@Args('providerId') input: string): Promise<ProviderPost> {
		console.log('Mutation: removeProviderPostyByAdmin');
		const providerId = shapeIntoMongoObjectId(input);
		return await this.providerPostService.removeProviderPostyByAdmin(providerId);
	}
}
