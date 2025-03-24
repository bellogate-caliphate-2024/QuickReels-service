import { Injectable } from '@nestjs/common';
import { LikeRepository } from '../repository/likes.repository';
import { CreateLikeDto } from '../dtos/likes.dto';
import { DatabaseHelper } from '../../helpers/helper';

@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly ACTION: DatabaseHelper,
  ) {}

  async createLike(createLikeDto: CreateLikeDto) {
    const { userId, contentId, time } = createLikeDto;

    const existingLike = await this.likeRepository.findLike(userId, contentId);
    if (existingLike) {
      return { message: 'User already liked this content' };
    }

    const formattedTime = new Date(await this.ACTION.formatTime(time));

    const newLike = await this.likeRepository.createLike({
      ...createLikeDto,
      time: formattedTime
    });

    return { message: 'Like added successfully', newLike };
  }
}
