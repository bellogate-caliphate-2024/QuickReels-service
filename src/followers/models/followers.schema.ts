import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Follower extends Document {
  @Prop({ required: true, type: String })
  followerEmail: string;

  @Prop({ required: true, type: String })
  followingEmail: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const FollowerSchema = SchemaFactory.createForClass(Follower);
