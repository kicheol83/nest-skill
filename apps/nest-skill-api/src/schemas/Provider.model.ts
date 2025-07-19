import { Schema } from 'mongoose';
import {
	ProviderLevel,
	ProviderLocation,
	ProviderRateType,
	ProviderStatus,
	ProviderType,
	ProviderWeekday,
	ProviderWorkWeekday,
} from '../libs/enums/provider.enum';

const ProviderSchema = new Schema(
	{
		providerType: {
			type: String,
			enum: ProviderType,
			required: true,
		},

		providerStatus: {
			type: String,
			enum: ProviderStatus,
			default: ProviderStatus.ACTIVE,
		},

		providerLocation: {
			type: String,
			enum: ProviderLocation,
			required: true,
		},

		providerLevel: {
			type: String,
			enum: ProviderLevel,
			default: ProviderLevel.NEW,
		},

		providerWorkWeekday: {
			type: String,
			enum: ProviderWorkWeekday,
			required: true,
		},

		providerWeekday: {
			type: [String],
			enum: ProviderWeekday,
			default: [],
		},

		providerRateType: {
			type: String,
			enum: ProviderRateType,
			required: true,
		},

		providerWorkDayLimit: {
			type: Number,
			default: 7,
		},

		providerStartTime: {
			type: String,
			required: true,
		},

		providerEndTime: {
			type: String,
			required: true,
		},

		providerAddress: {
			type: String,
			required: true,
		},

		providerTitle: {
			type: String,
			required: true,
		},

		providerWorkPrice: {
			type: Number,
			required: true,
		},

		providerViews: {
			type: Number,
			default: 0,
		},

		providerLikes: {
			type: Number,
			default: 0,
		},

		providerComments: {
			type: Number,
			default: 0,
		},

		providerRank: {
			type: Number,
			default: 0,
		},

		providerImages: {
			type: [String],
			required: true,
		},

		providerDesc: {
			type: String,
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
	{ timestamps: true, collection: 'provider' },
);

ProviderSchema.index({ memberId: 1, providerType: 1, providerLocation: 1, providerAddress: 1 }, { unique: true });

export default ProviderSchema;
