import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { AppService } from './app.service'
import { Throttle } from '@nestjs/throttler'
import { CacheInterceptor } from '@nestjs/cache-manager'

@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello()
	}
}
