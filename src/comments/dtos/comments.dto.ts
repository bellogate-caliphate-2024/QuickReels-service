// src/comments/dtos/comments.dto.ts
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ example: '123', description: 'The ID of the content to comment on' })
  @IsString()
  contentId: string;

  @ApiProperty({ example: 'user_abc123', description: 'The ID of the user making the comment' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'This is a great video!', description: 'The comment text' })
  @IsString()
  text: string;

  @ApiProperty({ example: 'parent_comment_id', description: 'The parent comment ID (empty if root)' })
  @IsString()
  parentId: string;
}
