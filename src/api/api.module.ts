import { Module } from '@nestjs/common'
import { ApiService } from './api.service'
import { ApiController } from './api.controller'
import { GraphModule } from './graph/graph.module'
import { CommandsModule } from './commands/commands.module'

@Module({
	controllers: [ApiController],
	providers: [ApiService],
	imports: [GraphModule, CommandsModule]
})
export class ApiModule {}
