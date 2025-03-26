import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Like extends Document {
  @Prop({ required: true, type: String }) // Store as String, not ObjectId
  contentId: string;

  @Prop({ required: true, type: String }) // Store as String, not ObjectId
  userId: string;

  @Prop({ default: Date.now })
  time: Date;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
