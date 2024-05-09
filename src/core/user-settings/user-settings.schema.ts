import mongoose from 'mongoose'

export const UserSettingsSchema = new mongoose.Schema(
	{
		notifications: {
			enabled: {
				type: Boolean,
				default: true
			},
			emails: {},
			sms: {}
		}
	},
	{ timestamps: true }
)

export class UserSettingsEntity {
	notifications: {
		enabled: boolean
		emails: any
		sms: any
	}
}
