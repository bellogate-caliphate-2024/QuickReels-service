import { IsString, IsOptional } from 'class-validator';

export class UpdateUserProgressDto {
  @IsString()
  userId: string;

  @IsString()
  postId: string;

  @IsOptional()
  @IsString()
  postCaption?: string;
}

export class UserProgressResponseDto {
  userId: string;
  postId: string;
  postCaption?: string;
} 