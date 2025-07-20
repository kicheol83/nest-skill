import { ObjectId } from 'bson';
export const AUTH_TIMER = 30;

export const availableProvidersSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRank'];

export const shapeIntoMongoObjectId = (target: any) => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};
