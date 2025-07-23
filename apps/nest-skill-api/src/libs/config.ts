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

/** IMAGE CONFIGURATION **/
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

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
