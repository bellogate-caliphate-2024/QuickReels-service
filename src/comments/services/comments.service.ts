import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '../repository/comments.repository';
import { CreateCommentDto } from '../dtos/comments.dto';
import { Comment } from '../models/comments.schema'; // Explicitly import the correct Comment type
import { createReplyDto } from '../dtos/reply.dto';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  async addComment(dto: CreateCommentDto | createReplyDto) {
    return this.commentRepository.createComment(dto);
  }

  async getComments(contentId: string, page: number, limit: number) {
    page = Number(page);
    limit = Number(limit);

    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1 || limit > 100) limit = 10;

    try {
      const totalComments =
        await this.commentRepository.getCommentCount(contentId);
      const totalPages = Math.ceil(totalComments / limit) || 1;

      page = page > totalPages ? totalPages : page;

      const offset = (page - 1) * limit;
      const comments = await this.commentRepository.getPaginatedComments(
        contentId,
        offset,
        limit,
      );

      return {
        contentId,
        currentPage: page,
        nextPage: page < totalPages ? page + 1 : null,
        isLastPage: page >= totalPages,
        totalComments,
        totalPages,
        comments,
      };
    } catch (error) {
      throw new Error(
        `Failed to retrieve comments: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }


  async getReplies(
    commentID: string,
    page,
    limit,
  ): Promise<any> {
    const replies = await this.commentRepository.getPaginatedComments(commentID, page, limit);
    
  }


  async deleteComment(commentId: string) {
    const deleted = await this.commentRepository.deleteComment(commentId);
    if (!deleted) throw new NotFoundException('Comment not found');

    return {
      success: true,
      message: 'Comment deleted successfully',
    };
  }
}
