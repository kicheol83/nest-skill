import { ObjectId } from 'bson';
export const AUTH_TIMER = 30;

export const shapeIntoMongoObjectId = (target: any) => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};
