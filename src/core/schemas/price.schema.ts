import mongoose, { ObjectId } from 'mongoose'

const PriceHistorySchema = new mongoose.Schema(
	{
		current: Number,
		history: [{ date: Date, value: Number }]
	},
	{ _id: false, timestamps: true }
)

export const PriceSchema = new mongoose.Schema(
	{
		tnd: PriceHistorySchema,
		usd: PriceHistorySchema,
		eur: PriceHistorySchema
	},
	{ _id: false }
)

export class PriceHistoryEntity {
	current: ObjectId
	history: [{ date: Date; value: number }]
}

export class PriceEntity {
	tnd: PriceHistoryEntity
	eur: PriceHistoryEntity
	usd: PriceHistoryEntity
}
