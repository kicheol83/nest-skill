import { Schema } from 'mongoose';

const AllChatSchema = new Schema(
	{
		sender: {
			type: String,
			required: true,
		},

		message: {
			type: String,
			required: true,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: false,
			ref: 'Member',
		},
	},
	{ timestamps: true, collection: 'allchat' },
);

export default AllChatSchema;
