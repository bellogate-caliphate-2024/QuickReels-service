import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: false })
  @IsOptional()
  @IsString()
  time?: string;

  @Prop({ required: true, unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsUrl()
  video_url: string[];

  @Prop({ required: false })
  @IsOptional()
  @IsUrl()
  thumbnail: string[];

  @Prop({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(10)
  caption?: string;

  @Prop({ required: false })
  @IsBoolean()
  Ismock: boolean;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  userProfilePicture: string;

  @Prop({ default: 0 })
  numberOfViews: number;

  @Prop({ default: 0 })
  numberOfLikes: number;

  @Prop({ default: 0 })
  numberOfComments: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
