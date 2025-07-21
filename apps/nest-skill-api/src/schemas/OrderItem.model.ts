import { Schema } from 'mongoose';

const OrderItemSchema = new Schema(
	{
		itemQuantity: {
			type: Number,
			required: true,
		},

		itemPrice: {
			type: Number,
			required: true,
		},

		orderId: {
			type: Schema.Types.ObjectId,
			ref: 'Order',
		},

		providerId: {
			type: Schema.Types.ObjectId,
			ref: 'Provider',
		},
	},
	{ timestamps: true, collection: 'orderItems' },
);

export default OrderItemSchema;
