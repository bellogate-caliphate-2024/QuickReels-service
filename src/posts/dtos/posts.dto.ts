import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEmail,
  IsBoolean,
  IsUrl,
  IsInt,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  id?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  time?: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiPropertyOptional({ type: String })
  video_url?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  caption?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ example: 0 })
  numberOfViews?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ example: 0 })
  numberOfLikes?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @ApiPropertyOptional({ example: 0 })
  numberOfComments?: number;

  @IsString()
  @ApiProperty()
  userName: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @ApiProperty({ example: true })
  Ismock: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  isLiked?: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  isAd?: boolean;
}
