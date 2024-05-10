import {
	OnGlobalQueueActive,
	OnGlobalQueueDrained,
	OnGlobalQueueError,
	OnGlobalQueueFailed,
	OnGlobalQueuePaused,
	OnGlobalQueueProgress,
	OnGlobalQueueStalled,
	OnGlobalQueueWaiting,
	OnQueueActive,
	Process,
	Processor
} from '@nestjs/bull'
import { Job } from 'bull'
import { HttpService } from '@nestjs/axios'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { commandStatus, Command } from './commands.schema'
import { AxiosError } from 'axios'

@Processor({ name: 'commands' })
export class CommandProcessor {
	constructor(
		@InjectModel(Command.name)
		private CommandsModel: Model<Command>,
		private readonly httpService: HttpService
	) {}

	@Process('callRequest')
	async callRequest(job: Job) {
		try {
			const { method, url, headers, body } = job.data.data
			const clientTargetRequest = await this.httpService[method](url, body, { headers })
				.toPromise()
				.catch(async (err: AxiosError) => {
					const updatedCommand = await this.CommandsModel.updateOne(
						{ _id: job.data.createdCommand._id },
						{
							responce: {
								data: err.toJSON(),
								statusCode: 500
							},
							status: commandStatus.COMPLETED,
							completedAt: Date.now(),
							job: {
								id: job.id
							}
						}
					)
				})

			const updatedCommand = await this.CommandsModel.updateOne(
				{ _id: job.data.createdCommand._id },
				{
					responce: {
						data: clientTargetRequest.data,
						statusCode: clientTargetRequest.status
					},
					status: commandStatus.COMPLETED,
					completedAt: Date.now(),
					job: {
						id: job.id
					}
				}
			)
		} catch (error) {
			throw new Error('callRequest Error: ' + error)
		}
	}

	@OnGlobalQueueError()
	onActive1(error: Error) {
		console.error(error)
	}

	@OnGlobalQueueWaiting()
	onActive2(jobId: number | string) {
		console.log(`OnGlobalQueueWaiting ${jobId}`)
	}

	@OnGlobalQueueActive()
	onActive3(job: Job) {
		console.log(`OnGlobalQueueActive ${job}`)
	}

	@OnGlobalQueueStalled()
	onActive4(job: Job) {
		console.log(`OnGlobalQueueStalled`)
	}

	@OnGlobalQueueProgress()
	onActive5(job: Job) {
		console.log(`OnGlobalQueueProgress`)
	}

	@OnGlobalQueueFailed()
	onActive6(job: Job, err: Error) {
		console.log(`OnGlobalQueueFailed ${job} ${err}`)
	}

	@OnGlobalQueuePaused()
	onActive7(job: Job) {
		console.log(`OnGlobalQueuePaused`)
	}

	@OnGlobalQueueDrained()
	onActive8(job: Job) {
		console.log(`OnGlobalQueueDrained`)
	}
}
