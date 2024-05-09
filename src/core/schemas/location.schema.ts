import mongoose from 'mongoose'

export const LocationSchema = new mongoose.Schema(
	{
		lat: String,
		lon: String,
		country: String,
		city: String,
		street: String,
		text: String
	},
	{ _id: false, timestamps: true }
)
