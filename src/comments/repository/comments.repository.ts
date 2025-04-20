import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '../models/comments.schema';
import { Post } from '../../posts/models/posts.schema';
import { CreateCommentDto } from '../dtos/comments.dto';
import { createReplyDto } from '../dtos/reply.dto';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) {}

  async createComment(
    dto: CreateCommentDto | createReplyDto,
  ): Promise<Comment> {
    const newComment = new this.commentModel(dto);
    const savedComment = await newComment.save();

    await this.postModel.findByIdAndUpdate(
      dto.contentId,
      { $inc: { numberOfComments: 1 } },
      { new: true },
    );

    return savedComment;
  }

  async getCommentCount(contentId: string): Promise<number> {
    return this.commentModel.countDocuments({ contentId }).exec();
  }

  async getPaginatedComments(
    contentId: string,
    page: number,
    limit: number,
  ): Promise<Comment[]> {
    page = Math.max(page, 1);
    const skip = (page - 1) * limit;

    return this.commentModel
      .find({ contentId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  }

  async deleteComment(commentId: string): Promise<boolean> {
    const comment = await this.commentModel.findById(commentId);
    if (!comment) return false;

    await this.commentModel.findByIdAndDelete(commentId);
    await this.postModel.findByIdAndUpdate(
      comment.contentId,
      { $inc: { numberOfComments: -1 } },
      { new: true },
    );

    return true;
  }
}
