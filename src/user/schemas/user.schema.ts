import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum Role {
  CUSTOMER = 'Customer',
  SUPER_USER = 'Super User',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  //To check if the email validated or not
  /* @Prop({ default: false, select: false })
  isEmailValidated: boolean; */

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  address: string;

  @Prop({ enum: Role, required: true })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
