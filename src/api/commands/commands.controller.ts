import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common'
import { CommandsService } from './commands.service'

@Controller('/api/commands')
export class CommandsController {
	constructor(private readonly commandService: CommandsService) {}

	@Post()
	create(@Body() request) {
		return this.commandService.create({ request })
	}

	@Get()
	findOne(@Query() query) {
		return this.commandService.findOne({ _id: query._id })
	}
}
