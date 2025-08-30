import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
	MEMBER = 'MESSAGES',
	ARTICLE = 'ARTICLE',
	ORDER = 'ORDER',
	PAYMENT = 'PAYMENT',
	REVIEW = 'REVIEW',
	COMMENT = 'COMMENT',
	FOLLOW = 'FOLLOW',
	UN_FOLLOW = 'UN_FOLLOW',
}
registerEnumType(NotificationType, {
	name: 'NotificationType',
});
