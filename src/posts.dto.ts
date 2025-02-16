// src/posts/dto/create-post.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsArray, IsEmail, IsEmpty, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  time?: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  video_url?: string[];

  @IsOptional()
  @IsString({ each: true })
  thumbnail?: string[];

  @IsOptional()
  @IsString()
  caption?: string;


  @IsBoolean()
  @Transform(({ value }) => value === 'true') 
  Ismock: boolean;



}