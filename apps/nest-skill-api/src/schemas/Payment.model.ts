import mongoose, { Schema } from 'mongoose';
import { PaymentMethod, PaymentStatus } from '../libs/enums/payment.enum';

const PaymentSchema = new Schema(
	{
		paymentAmount: {
			type: Number,
			required: true,
		},

		paymentStatus: {
			type: String,
			enum: PaymentStatus,
			default: PaymentStatus.PENDING,
		},

		paymentMethod: {
			type: String,
			enum: PaymentMethod,
			required: true,
		},

		transactionId: {
			type: String,
		},

		orderId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Order',
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true },
);

export default mongoose.model('payment', PaymentSchema);
