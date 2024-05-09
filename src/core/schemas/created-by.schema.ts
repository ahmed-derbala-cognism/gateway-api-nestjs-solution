import { User } from '@users/users.schema'
import mongoose from 'mongoose'

export const CreatedBySchema = new mongoose.Schema(
	{
		kind: {
			type: String,
			enum: [User.name],
			required: true,
			default: User.name
		},
		kindId: {
			type: mongoose.Schema.Types.ObjectId,
			refPath: 'kind',
			required: true
		}
	},
	{
		_id: false,
		required: true
	}
)
