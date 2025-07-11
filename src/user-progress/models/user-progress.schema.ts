import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class UserProgress extends Document {
  @Prop({ required: true, ref: 'User' })
  userId: string;

  @Prop({ required: true, ref: 'Post' })
  postId: string;

  @Prop()
  postCaption: string;
}

export const UserProgressSchema = SchemaFactory.createForClass(UserProgress); 