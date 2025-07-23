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

export const OrderStatusAdmin = [
	OrderStatus.CANCELED,
	OrderStatus.COMPLETED,
	OrderStatus.CONFIRMED,
	OrderStatus.EXPIRED,
	OrderStatus.IN_PROGRESS,
	OrderStatus.PAID,
	OrderStatus.PENDING,
	OrderStatus.REFUNDED,
	OrderStatus.REJECTED,
];

export const OrderStatusMyOrder = [
	OrderStatus.PENDING,
	OrderStatus.CONFIRMED,
	OrderStatus.IN_PROGRESS,
	OrderStatus.COMPLETED,
	OrderStatus.PAID,
	OrderStatus.CANCELED,
	OrderStatus.REJECTED,
	OrderStatus.EXPIRED,
	OrderStatus.REFUNDED,
];
