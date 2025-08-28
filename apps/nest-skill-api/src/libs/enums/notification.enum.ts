import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
	MEMBER = 'MESSAGES',
	ARTICLE = 'ARTICLE',
	ORDER = 'ORDER',
	PAYMENT = 'PAYMENT',
	REVIEW = 'REVIEW',
}
registerEnumType(NotificationType, {
	name: 'NotificationType',
});
