import mongoose from 'mongoose';
import { Role } from '@roles/role.enum';
import {
  UserProfile,
  UserProfileSchema,
} from '@core/schemas/user-profile.schema';
import {
  UserSettingsEntity,
  UserSettingsSchema,
} from '@core/user-settings/user-settings.schema';
import { PermissionsEnum } from '@core/auth/permissions/permissions.enum';

export enum commandStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
}
export const commandsSchemaName = 'commands';
export const CommandsSchema = new mongoose.Schema(
  {
    responce: {
      data: {
        type: Object,
        required: false,
      },
      statusCode: {
        type: Number,
        required: false,
        enum: [200, 500, 400],
      },
    },
    status: {
      type: String,
      enum: commandStatus,
      default: commandStatus.PENDING,
      required: true,
    },
    checkedAt: {
      //last time checked
      type: Date,
      required: false,
    },
    completedAt: {
      //when error or success
      type: Date,
      required: false,
    },
    request: {
      headers: {
        type: Object,
        required: true,
      },
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
    },
  },
  { timestamps: true },
);

export class CommandEntity {
  result: Object;
}
