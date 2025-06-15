// src/comments/dtos/reply.dto.ts
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class createReplyDto {
  @ApiProperty({ example: 'parent_comment_id', description: 'The comment ID this is replying to' })
  @IsString()
  parentId: string;

  @ApiProperty({ example: 'Thanks for the feedback!', description: 'Reply text' })
  @IsString()
  text: string;

  @ApiPropertyOptional({ example: 'content_id', description: 'The content ID, if applicable' })
  @IsOptional()
  @IsString()
  contentId?: string;
}
