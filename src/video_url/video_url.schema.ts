import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsNotEmpty, IsObject, IsString, IsUrl } from 'class-validator';

export type video_urlDocument = Video_Url & Document;

@Schema({ timestamps: true })
export class Video_Url {

  @Prop({})
  time: string;

  @Prop({ required: true})
  @IsNotEmpty()
  @IsString()
  email: string;

  @Prop({ required: true }) // Specify type as String for video_url
  @IsNotEmpty()
  video_url: string; // This will store an object as a JSON string

  @Prop({}) // Specify type as String for thumbnail_url
  @IsNotEmpty()
  thumbnail: string; // This will store an object as a JSON string

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  caption: string;

}

export const video_urlSchema = SchemaFactory.createForClass(Video_Url);
