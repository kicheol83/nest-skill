import mongoose, { Schema } from 'mongoose';

const ReviewSchema = new Schema(
	{
		reviewRating: {
			type: Number,
			required: true,
		},

		reviewComments: {
			type: String,
		},

		reviewImages: {
			type: [String],
			default: [],
		},

		orderId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Order',
		},

		providerId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Provider',
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

export default mongoose.model('review', ReviewSchema);
