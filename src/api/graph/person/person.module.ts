import { Module } from '@nestjs/common'
import { PersonService } from './person.service'
import { PersonController } from './person.controller'
import { HttpModule } from '@nestjs/axios'

@Module({
	imports: [HttpModule],
	controllers: [PersonController],
	providers: [PersonService]
})
export class PersonModule {}
