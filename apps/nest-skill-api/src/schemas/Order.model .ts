import { Schema } from 'mongoose';
import { OrderStatus } from '../libs/enums/order.enum';

const OrderSchema = new Schema(
	{
		orderPrice: {
			type: Number,
			required: true,
		},

		webTax: {
			type: Number,
			required: true,
		},

		totalPrice: {
			type: Number,
			required: true,
		},

		orderStatus: {
			type: String,
			enum: OrderStatus,
			default: OrderStatus.PENDING,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
	},
	{ timestamps: true },
);

export default OrderSchema;
