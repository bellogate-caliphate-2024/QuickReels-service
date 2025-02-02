import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  
    @IsString()
    @IsNotEmpty()
    videoId: string;
  
    @IsString()
    @IsNotEmpty()
    userId: string;
  
    @IsString()
    @IsNotEmpty()
    time: string;
  
    @IsString()
    @IsNotEmpty()
    caption: string;
  
    @IsOptional()
    @IsString()
    email?: string;
  
    @IsOptional()
    @IsString()
    videoUrl?: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;
    
}

export const PostSchema = SchemaFactory.createForClass(Post);
