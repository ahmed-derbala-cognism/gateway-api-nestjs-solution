import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';

@Controller('/api/commands')
export class CommandsController {
  constructor(private readonly commandService: CommandsService) {}

  @Post()
  create(@Body() body) {
    return this.commandService.create({ request: body });
  }

  @Get()
  findOne(@Query() query) {
    return this.commandService.findOne({ _id: query._id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommandDto: UpdateCommandDto) {
    return this.commandService.update(+id, updateCommandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commandService.remove(+id);
  }
}
