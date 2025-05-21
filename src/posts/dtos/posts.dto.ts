import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEmail,
  IsEmpty,
  IsBoolean,
  IsUrl,
  IsInt,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  id?: string;

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
  video_url?: string;

  @IsOptional()
  @IsString({ each: true })
  thumbnail?: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  numberOfViews?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  numberOfLikes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  numberOfComments?: number;

  @IsString()
  userName: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  Ismock: boolean;

  @IsOptional()
  @IsString()
  isLiked?: boolean;

  @IsOptional()
  @IsString()
  isAd?: boolean;
}
