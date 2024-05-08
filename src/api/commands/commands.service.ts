import { Injectable } from '@nestjs/common';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import { HttpService } from '@nestjs/axios';
import {
  CommandEntity,
  commandStatus,
  commandsSchemaName,
} from './commands.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class CommandsService {
  constructor(
    @InjectModel(commandsSchemaName)
    private CommandsModel: Model<CommandEntity>,
    private readonly httpService: HttpService,
    @InjectQueue('commands') private commandQueue: Queue,
  ) {}

  async create({ request }) {
    try {
      //console.log({ method, url, headers, body })
      //  console.log(request)
      const createdCommand = await this.CommandsModel.create({ request });

      const job = await this.commandQueue.add('callRequest', {
        data: request,
        createdCommand,
      });
      //console.log(job)
      return createdCommand;
    } catch (error) {
      throw new Error('Error: ' + error.message);
    }
  }

  async findOne({ _id }) {
    try {
      const fetchedCommand = await this.CommandsModel.findOne({ _id });

      return fetchedCommand;
    } catch (error) {
      throw new Error('Error: ' + error.message);
    }
  }

  findAll() {
    return `This action returns all command`;
  }

  update(id: number, updateCommandDto: UpdateCommandDto) {
    return `This action updates a #${id} command`;
  }

  remove(id: number) {
    return `This action removes a #${id} command`;
  }
}
