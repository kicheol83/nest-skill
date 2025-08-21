import { registerEnumType } from '@nestjs/graphql';

export enum PaymentStatus {
	PENDING = 'PENDING',
	PAID = 'PAID',
	FAILED = 'FAILED',
	REFUNDED = 'REFUNDED',
}
registerEnumType(PaymentStatus, {
	name: 'PaymentStatus',
});

export enum PaymentMethod {
	CARD = 'CARD',
	BANK_TRANSFER = 'BANK_TRANSFER',
	CASH = 'CASH',
	VIRTUAL = 'VIRTUAL',
}
registerEnumType(PaymentMethod, {
	name: 'PaymentMethod',
});
