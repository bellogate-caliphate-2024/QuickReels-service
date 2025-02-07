// src/posts/dto/create-post.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  video_url?: string[];  // Updated to be an array of strings

  @IsOptional()
  @IsString({ each: true })
  thumbnail?: string[];

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsString()
  time?: string;
}