import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema, usersSchemaName } from './users.schema';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([{ name: usersSchemaName, schema: UsersSchema }]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
