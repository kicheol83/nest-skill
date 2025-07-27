import { ObjectId } from 'bson';
export const AUTH_TIMER = 30;
export const CREATE_JOB_LIMIT = 3;

export const availableProvidersUserSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRank'];
export const availableMembersSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews'];

export const availableDayLimit = [1, 2, 3, 4, 5, 6, 7];
export const availableProviderPostSorts = [
	'createdAt',
	'updatedAt',
	'providerLikes',
	'providerViews',
	'providerRank',
	'providerWorkPrice',
	'providerLevel',
];
export const availableBoardArticleSorts = ['createdAt', 'updatedAt', 'articleLikes', 'articleViews'];

export const availableOrdersSorts = ['createdAt', 'updatedAt', 'orderPrice', 'orderDelivery', 'orderStatus'];
export const availableCommentSorts = ['createdAt', 'updatedAt'];
export const availableReviewSorts = ['createdAt', 'updatedAt'];
export const availablePaymentSorts = ['createdAt', 'updatedAt'];

/** IMAGE CONFIGURATION **/
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { T } from './types/common';

export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => {
	const ext = path.parse(filename).ext;
	return uuidv4() + ext;
};

export const shapeIntoMongoObjectId = (target: any) => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};

export const lookupMember = {
	$lookup: {
		from: 'members',
		localField: 'memberId',
		foreignField: '_id',
		as: 'memberData',
	},
};

export const lookupProvider = {
	$lookup: {
		from: 'provider',
		localField: 'providerId',
		foreignField: '_id',
		as: 'providerData',
	},
};

export const lookupFollowingData = {
	$lookup: {
		from: 'members',
		localField: 'followingId',
		foreignField: '_id',
		as: 'followingData',
	},
};

export const lookupFollowerData = {
	$lookup: {
		from: 'members',
		localField: 'followerId',
		foreignField: '_id',
		as: 'followerData',
	},
};
export const lookupAuthMemberLiked = (memberId: T, targetRefId: string = '$_id') => {
	return {
		$lookup: {
			from: 'likes',
			let: {
				localLikeRefId: targetRefId,
				localMemberId: memberId,
				localMyFavorite: true,
			},
			pipeline: [
				{
					$match: {
						$expr: {
							$and: [{ $eq: ['$likeRefId', '$$localLikeRefId'] }, { $eq: ['$memberId', '$$localMemberId'] }],
						},
					},
				},
				{
					$project: {
						_id: 0,
						memberId: 1,
						likeRefId: 1,
						myFavorite: '$$localMyFavorite',
					},
				},
			],
			as: 'meLiked',
		},
	};
};

interface LookAuthMemberFollowed {
	followerId: T;
	followingId: string;
}

export const lookupAuthMemberFollowed = (input: LookAuthMemberFollowed) => {
	const { followerId, followingId } = input;
	return {
		$lookup: {
			from: 'follows',
			let: {
				localFollowerId: followerId,
				localFollowingId: followingId,
				localMyFavorite: true,
			},
			pipeline: [
				{
					$match: {
						$expr: {
							$and: [{ $eq: ['$followerId', '$$localFollowerId'] }, { $eq: ['$followingId', '$$localFollowingId'] }],
						},
					},
				},
				{
					$project: {
						_id: 0,
						followerId: 1,
						followingId: 1,
						myFollowing: '$$localMyFavorite',
					},
				},
			],
			as: 'meFollowed',
		},
	};
};

export const lookupFavorite = {
	$lookup: {
		from: 'members',
		localField: 'favoriteProviderPost.memberId',
		foreignField: '_id',
		as: 'favoriteProviderPost.memberData',
	},
};

export const lookupVisit = {
	$lookup: {
		from: 'members',
		localField: 'visitedProviderPost.memberId',
		foreignField: '_id',
		as: 'visitedProviderPost.memberData',
	},
};
