import { registerEnumType } from '@nestjs/graphql';

export enum ProviderType {
	PLUMBING = 'PLUMBING', //
	CLEANING = 'CLEANING',
	BABYSITTING = 'BABYSITTING',
	FURNITURE = 'FURNITURE', //
	GARDENING = 'GARDENING',
	ELECTRICIAN = 'ELECTRICIAN', //
	PHOTOGRAPHY = 'PHOTOGRAPHY',
	COOKING = 'COOKING',
	DRIVING = 'DRIVING',
	PAINTING = 'PAINTING', //
	CARPENTRY = 'CARPENTRY', //
	GUTTER = 'GUTTER', //
	SIDING = 'SIDING', //
	DELIVERING = 'DELIVERING',
	REPAIRS = 'REPAIRS', //
}

registerEnumType(ProviderType, {
	name: 'ProviderType',
});

export enum ProviderLocation {
	SEOUL = 'SEOUL',
	BUSAN = 'BUSAN',
	INCHEON = 'INCHEON',
	DAEGU = 'DAEGU',
	GYEONGJU = 'GYEONGJU',
	GWANGJU = 'GWANGJU',
	CHONJU = 'CHONJU',
	DAEJON = 'DAEJON',
	JEJU = 'JEJU',
}
registerEnumType(ProviderLocation, {
	name: 'ProviderLocation',
});

export enum ProviderStatus {
	PENDING = 'PENDING',
	ACTIVE = 'ACTIVE',
	SUSPENDED = 'SUSPENDED',
	DEACTIVATED = 'DEACTIVATED',
	BANNED = 'BANNED',
	DELETE = 'DELETE',
}
registerEnumType(ProviderStatus, {
	name: 'ProviderStatus',
});

export enum ProviderLevel {
	NEW = 'NEW', // 3
	BRONZE = 'BRONZE', // 3
	SILVER = 'SILVER', // 4
	GOLD = 'GOLD', // 5
	PLATINUM = 'PLATINUM', // 6
	VERIFIED = 'VERIFIED', // 7
}
registerEnumType(ProviderLevel, {
	name: 'ProviderLevel',
});

export enum ProviderWorkWeekday {
	WEEKDAYS = 'WEEKDAYS',
	WEEKENDS = 'WEEKENDS',
	FULL_WEEK = 'FULL_WEEK',
	CUSTOM = 'CUSTOM',
}
registerEnumType(ProviderWorkWeekday, {
	name: 'ProviderWorkWeekday',
});

export enum ProviderWeekday {
	MONDAY = 'MONDAY',
	TUESDAY = 'TUESDAY',
	WEDNESDAY = 'WEDNESDAY',
	THURSDAY = 'THURSDAY',
	FRIDAY = 'FRIDAY',
	SATURDAY = 'SATURDAY',
	SUNDAY = 'SUNDAY',
}
registerEnumType(ProviderWeekday, {
	name: 'ProviderWeekday',
});

export enum ProviderRateType {
	HOURLY = 'HOURLY',
	FIXED = 'FIXED',
	NEGOTIABLE = 'NEGOTIABLE',
}
registerEnumType(ProviderRateType, {
	name: 'ProviderRateType',
});
