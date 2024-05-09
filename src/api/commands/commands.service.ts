import { Injectable } from '@nestjs/common'
import { Command } from './commands.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

@Injectable()
export class CommandsService {
	constructor(
		@InjectModel(Command.name)
		private CommandsModel: Model<Command>,
		@InjectQueue('commands') private commandQueue: Queue
	) {}

	async create({ request }) {
		try {
			const createdCommand = await this.CommandsModel.create({ request })

			const job = await this.commandQueue.add('callRequest', {
				data: request,
				createdCommand
			})
			return createdCommand
		} catch (error) {
			throw new Error('Error: ' + error.message)
		}
	}

	async findOne({ _id }) {
		try {
			const checkedAt = new Date(Date.now())
			let fetchedCommand = await this.CommandsModel.findOne({ _id }).lean()
			if (fetchedCommand) {
				const updatedCommand = await this.CommandsModel.updateOne({ _id }, { checkedAt })
				fetchedCommand.checkedAt = checkedAt
			}

			return fetchedCommand
		} catch (error) {
			throw new Error('Error: ' + error.message)
		}
	}
}
