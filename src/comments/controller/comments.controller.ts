import { Controller, Post, Get, Body, Param, Query, Delete, UseGuards } from '@nestjs/common';
import { CommentService } from '../services/comments.service';
import { CreateCommentDto } from '../dtos/comments.dto';
import { createReplyDto } from '../dtos/reply.dto';
import { JwtAuthGuard } from '../../auth/guards/auth.guards';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Comments')
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new comment' })
  @ApiResponse({ status: 201, description: 'Comment successfully added' })
  async addComment(@Body() dto: CreateCommentDto) {
    return this.commentService.addComment(dto);
  }

  @Post(':commentId/reply')
  @ApiOperation({ summary: 'Reply to a comment' })
  @ApiResponse({ status: 201, description: 'Reply successfully added' })
  async replyToComment(
    @Param('commentId') commentId: string,
    @Body() dto: createReplyDto,
  ) {
    dto.parentId = commentId;
    return this.commentService.addComment(dto);
  }

  @Get(':contentId')
  @ApiOperation({ summary: 'Get comments for content' })
  @ApiResponse({ status: 200, description: 'Comments fetched successfully' })
  async getComments(
    @Param('contentId') contentId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.commentService.getComments(contentId, page, limit);
  }

  @Get(':commentId/replies')
  @ApiOperation({ summary: 'Get replies to a comment' })
  @ApiResponse({ status: 200, description: 'Replies fetched successfully' })
  async getReplies(
    @Param('commentId') commentId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.commentService.getReplies(commentId, page, limit);
  }

  @Delete(':commentId')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  async deleteComment(@Param('commentId') commentId: string) {
    return this.commentService.deleteComment(commentId);
  }
}
