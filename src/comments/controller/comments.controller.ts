import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { CommentService } from '../services/comments.service';
import { CreateCommentDto } from '../dtos/comments.dto';
import { createReplyDto } from '../dtos/reply.dto';
import { Delete } from '@nestjs/common';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async addComment(@Body() dto: CreateCommentDto) {
    return this.commentService.addComment(dto);
  }

  @Post(':commentId/reply')
  async replyToComment(
    @Param('commentId') commentId: string,
    @Body() dto: createReplyDto,
  ): Promise<any> {
    dto.parentId = commentId;
    return this.commentService.addComment(dto);
  }

  @Get(':contentId')
  async getComments(
    @Param('contentId') contentId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.commentService.getComments(contentId, page, limit);
  }

  @Get(':commentId/replies')
  async getReplies(
    @Param('commentId') commentId: string,
    @Query('page') page,
    @Query('limit') limit,
  ) {
    return this.commentService.getRepliesByCommentId(commentId, page, limit);
  }

  @Delete(':commentId')
  async deleteComment(@Param('commentId') commentId: string) {
    return this.commentService.deleteComment(commentId);
  }
}
