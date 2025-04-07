// src/comments/dtos/comments.dto.ts
import { Optional } from '@nestjs/common';
import { IsString } from 'class-validator';

export class createReplyDto {
  @IsString()
  parentId: string;

  @IsString()
  text: string;

  @Optional()
  contentId: string;
}
