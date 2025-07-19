import { registerEnumType } from '@nestjs/graphql';

export enum MemberType {
	USER = 'USER',
	PROVIDER = 'PROVIDER',
	ADMIN = 'ADMIN',
}

registerEnumType(MemberType, {
	name: 'MemberType',
});

export enum MemberStatus {
	ACTIVE = 'ACTIVE',
	BLOCK = 'BLOCK',
	DELETE = 'DELETE',
}

registerEnumType(MemberStatus, {
	name: 'MemberStatus',
});

export enum MemberAuthType {
	PHONE = 'PHONE',
	EMAIL = 'EMAIL',
	GOOGLE = 'GOOGLE',
}

registerEnumType(MemberAuthType, {
	name: 'MemberAuthType',
});
