import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	MEMBER = 'MEMBER',
	PROVIDER_POST = 'PROVIDER_POST',
	ARTICLE = 'ARTICLE',
	NOTIFI
}
registerEnumType(LikeGroup, {
	name: 'LikeGroup',
});
