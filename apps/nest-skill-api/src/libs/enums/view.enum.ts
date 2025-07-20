import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	PROVIDER = 'PROVIDER',
}
registerEnumType(ViewGroup, {
	name: 'ViewGroup',
});
