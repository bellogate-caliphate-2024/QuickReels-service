import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {

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
  thumbnail?: string[];

  @Prop({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(10)
  caption?: string;

}

export const userSchema = SchemaFactory.createForClass(User);
