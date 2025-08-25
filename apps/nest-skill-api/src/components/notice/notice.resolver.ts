import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NoticeService } from './notice.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Notice, Notices } from '../../libs/dto/notice/notice';
import { CreateNotice, NoticeInquiry } from '../../libs/dto/notice/notice.input';
import { NoticeUpdate } from '../../libs/dto/notice/notice.update';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';

@Resolver()
export class NoticeResolver {
	constructor(private readonly noticeService: NoticeService) {}

	// ================== GET ACTIVE NOTICES ==================
	@UseGuards(WithoutGuard)
	@Query(() => Notices)
	public async getActiveNotices(
		@Args('input') input: NoticeInquiry, //
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notices> {
		console.log('Query: getActiveNotices');
		return this.noticeService.getActiveNotices(memberId, input);
	}

	// ================== GET NOTICE BY ID ==================
	@UseGuards(WithoutGuard)
	@Query(() => Notice)
	public async getNoticeByIdForUser(
		@Args('_id') _id: string, //
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notice> {
		console.log('Query: getActiveNotices');
		return this.noticeService.getNoticeByIdForUser(memberId, _id);
	}

	// ================== CREATE ==================
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Notice)
	public async createNotice(
		@Args('input') input: CreateNotice, //
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notice> {
		console.log('Mutation: createNotice ');
		return await this.noticeService.createNotice(memberId, input);
	}

	// ================== UPDATE ==================
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Notice)
	public async updateNotice(
		@Args('input') input: NoticeUpdate, //
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notice> {
		console.log('input =>', input);
		console.log('Mutation: updateNotice');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.noticeService.updateNotice(memberId, input);
	}

	// ================== DELETE ==================
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Boolean)
	public async deleteNotice(
		@Args('_id') _id: string, //
		@AuthMember('_id') memberId: ObjectId,
	): Promise<boolean> {
		console.log('Mutation: deleteNotice');
		_id = shapeIntoMongoObjectId(_id);
		return await this.noticeService.deleteNotice(memberId, _id);
	}

	// ================== GET ALL ==================
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Notices)
	public async getNoticesForAdmin(
		@Args('input') input: NoticeInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notices> {
		console.log('Query: getNoticesForAdmin');
		return await this.noticeService.getNoticesForAdmin(memberId, input);
	}

	// ================== GET BY ID ==================
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Notice)
	public async getNoticeById(@Args('_id') _id: string): Promise<Notice> {
		console.log('Query: getNoticeById');
		return await this.noticeService.getNoticeById(_id);
	}
}
