import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ required: true })
  contentId: string;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ default: null })
  parentId?: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
