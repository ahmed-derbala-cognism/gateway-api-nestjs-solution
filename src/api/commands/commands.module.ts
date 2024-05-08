import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CommandsController } from './commands.controller';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { commandsSchemaName, CommandsSchema } from './commands.schema';
import { BullModule } from '@nestjs/bull';
import { join } from 'path';
import { CommandProcessor } from './commands.processor';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: commandsSchemaName, schema: CommandsSchema },
    ]),

    BullModule.registerQueue({
      name: 'commands',
    }),
  ],
  controllers: [CommandsController],
  providers: [CommandsService, CommandProcessor],
})
export class CommandsModule {}
