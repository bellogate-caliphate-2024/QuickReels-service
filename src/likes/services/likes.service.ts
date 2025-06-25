import { Injectable, NotFoundException } from '@nestjs/common';
import { LikeRepository } from '../repository/like.repository';
import { CreateLikeDto } from '../dtos/likes.dto';
import { DatabaseHelper } from '../../helpers/helper';

@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly ACTION: DatabaseHelper,
  ) {}

  async createLike(createLikeDto: CreateLikeDto) {
    const { userEmail, contentId, time } = createLikeDto;

    const existingLike = await this.likeRepository.findLike(userEmail, contentId);
    if (existingLike) {
      return { message: 'User already liked this content' };
    }

    const formattedTime = new Date(await this.ACTION.formatTime(time));

    const newLike = await this.likeRepository.createLike({
      ...createLikeDto,
      time: formattedTime,
    });

    return { message: 'Like added successfully', newLike };
  }


  async removeLike(userEmail: string, contentId: string) {
    const result = await this.likeRepository.deleteLike(userEmail, contentId);
    if (!result) {
      throw new NotFoundException('Like not found');
    }
    return { message: 'Like removed successfully' };
  }


  async getLikesCount(contentId: string) {
    const count = await this.likeRepository.getLikesCount(contentId);
    return { likesCount: count };
  }

  async getContentLikes(contentId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [likes, total] = await Promise.all([
      this.likeRepository.getContentLikes(contentId, skip, limit),
      this.likeRepository.getLikesCount(contentId),
    ]);

    return {
      likes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  async checkUserLike(userEmail: string, contentId: string) {
    const like = await this.likeRepository.findLike(userEmail, contentId);
    return { hasLiked: !!like };
  }

  async getUserLikes(userEmail: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [likes, total] = await Promise.all([
      this.likeRepository.getUserLikes(userEmail, skip, limit),
      this.likeRepository.getUserLikesCount(userEmail),
    ]);

    return {
      likes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }
}
