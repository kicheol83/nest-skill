import { OrderStatus } from '../enums/order.enum';

export const OrderStatusSort = [
	OrderStatus.CANCELED,
	OrderStatus.COMPLETED,
	OrderStatus.CONFIRMED,
	OrderStatus.IN_PROGRESS,
	OrderStatus.PAID,
	OrderStatus.PENDING,
	OrderStatus.REFUNDED,
	OrderStatus.REJECTED,
];
