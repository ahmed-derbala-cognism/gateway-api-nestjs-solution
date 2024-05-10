import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApiModule } from './api/api.module'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { CacheModule } from '@nestjs/cache-manager'
import { AuthModule } from './core/auth/auth.module'
import { UsersModule } from '@users/users.module'
import config, { Iconfig } from '@config/config'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { BullModule } from '@nestjs/bull'
import { LoggerModule } from 'nestjs-pino'

@Module({
	imports: [
		ApiModule,
		ThrottlerModule.forRoot([
			{
				ttl: 60000,
				limit: 10
			}
		]),
		CacheModule.register({
			isGlobal: true,
			ttl: 30000
		}),
		AuthModule,
		UsersModule,
		ConfigModule.forRoot({ isGlobal: true, load: [config] }),
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				uri: configService.get<string>('db.mongo.uri'),
				...config().db.mongo.options
			})
		}),
		BullModule.forRoot({
			redis: {
				host: 'localhost',
				port: 6379
			}
		}),
		LoggerModule.forRoot()
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	]
})
export class AppModule {}
