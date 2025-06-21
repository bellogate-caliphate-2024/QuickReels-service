import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  userName: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop()
  accessToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
