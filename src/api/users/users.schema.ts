import { PermissionsEnum } from '@core/auth/permissions/permissions.enum';
import { Role } from '@core/auth/roles/role.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
  /* @IsNotEmpty()
   @IsString()
   @Prop({ required: true })
   username: string;*/

  @IsNotEmpty()
  @IsEmail()
  @Prop({ required: true, unique: true })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Prop({ required: true })
  password: string;

  @Prop({ required: true, type: [String], enum: Object.values(Role) })
  roles: [String];

  @Prop({
    required: true,
    type: [String],
    enum: Object.values(PermissionsEnum),
    default: [PermissionsEnum.ViewPerson],
  })
  permissions: [String];
}
export type UserDocument = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
