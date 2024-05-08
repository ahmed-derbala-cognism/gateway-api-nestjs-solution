import { PermissionsEnum } from '@core/auth/permissions/permissions.enum';
import { Role } from '@core/auth/roles/role.enum';
import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsDate,
  IsOptional,
} from 'class-validator';
import { HydratedDocument } from 'mongoose';

export enum commandStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

@Schema()
export class Command {
  @IsNotEmpty()
  @IsString()
  @Prop({
    required: true,
    type: String,
    enum: commandStatus,
    default: commandStatus.PENDING,
  })
  status: string;

  @IsOptional()
  @IsDate()
  @Prop({ required: false, type: Date })
  checkedAt: Date;

  @IsOptional()
  @IsDate()
  @Prop({ required: false, type: Date })
  completedAt: Date;

  @Prop(
    raw({
      headers: { type: Object, required: true },
      body: {
        type: Object,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      method: {
        type: String,
        enum: ['post', 'get', 'delete', 'patch', 'put'],
        required: true,
      },
    }),
  )
  request: Record<string, any>;

  @Prop(
    raw({
      data: {
        type: Object,
        required: false,
      },
      statusCode: {
        type: Number,
        required: false,
        enum: [200, 500, 400],
      },
    }),
  )
  responce: Record<string, any>;
}
export type CommandDocument = HydratedDocument<Command>;

export const CommandSchema = SchemaFactory.createForClass(Command);
