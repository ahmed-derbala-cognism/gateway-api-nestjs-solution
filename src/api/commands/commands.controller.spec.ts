import { Test, TestingModule } from '@nestjs/testing'
import { CommandController } from './commands.controller'
import { CommandService } from './commands.service'

describe('CommandController', () => {
	let controller: CommandController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CommandController],
			providers: [CommandService]
		}).compile()

		controller = module.get<CommandController>(CommandController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})
})
