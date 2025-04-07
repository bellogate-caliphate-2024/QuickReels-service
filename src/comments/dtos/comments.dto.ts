// src/comments/dtos/comments.dto.ts
import { IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  contentId: string;

  @IsString()
  userId: string;

  @IsString()
  text: string;

  @IsString()
  parentId: string;
}
