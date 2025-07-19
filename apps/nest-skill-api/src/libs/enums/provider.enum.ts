import { registerEnumType } from '@nestjs/graphql';

export enum ProviderType {
	PET_CARE = 'Pet Care',
	HOME_CLEANING = 'Home Cleaning',
	PLUMBING = 'Plumbing',
	ELECTRICIAN = 'Electrician',
	BABYSITTING = 'Babysitting',
	ELDERLY_CARE = 'Elderly Care',
	TUTORING = 'Tutoring',
	CAR_REPAIR = 'Car Repair',
	BEAUTY_SALON = 'Beauty & Salon',
	PERSONAL_TRAINING = 'Personal Training',
	GARDENING = 'Gardening & Landscaping',
	MOVING_DELIVERY = 'Moving & Delivery',
	APPLIANCE_REPAIR = 'Home Appliance Repair',
	IT_SUPPORT = 'IT Support',
	PHOTOGRAPHY = 'Photography & Videography',
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
