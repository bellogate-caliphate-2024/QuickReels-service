import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  
  @Prop({ required: true }) 
  @IsNotEmpty()
  @IsString()
  title: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  content: string;

  @Prop({ required: false })
  @IsOptional()
  @IsString()
  author?: string;

  @Prop({ required: false })
  @IsOptional()
  @IsString({ each: true }) // Ensures each tag is a string
  tags?: string[];
}

export const PostSchema = SchemaFactory.createForClass(Post);
