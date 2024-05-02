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

export const usersSchemaName = 'users';
export const UsersSchema = new mongoose.Schema(
  {
    username: String,
    email: { unique: true, type: String },
    profile: { type: UserProfileSchema, select: false },
    password: { type: String, select: false },
    roles: {
      type: [String],
      required: true,
      enum: Object.values(Role),
    },
    settings: { type: UserSettingsSchema, select: false },
  },
  { timestamps: true },
);

export class UserEntity {
  username: string;
  email: string;
  profile: UserProfile;
  password: string;
  roles: string[];
  settings: UserSettingsEntity;
}
