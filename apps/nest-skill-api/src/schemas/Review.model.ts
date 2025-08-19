import { Schema } from 'mongoose';
// reviewRating default => 0
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

		orderItemId: {
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

export default ReviewSchema;
