import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from '../Schemas/likes.schema';
import { CreateLikeDto } from 'src/dtos/likes.dto';
import { DatabaseHelper } from '../helpers/helper';

@Injectable()
export class LikeService {
  constructor(
    @InjectModel(Like.name) private likeModel: Model<Like>,
    private readonly ACTION: DatabaseHelper,
  ) {}

  async createLike(createLikeDto: CreateLikeDto) {
    const { userId, contentId, time } = createLikeDto;

    const existingLike = await this.likeModel.findOne({ userId, contentId });
    if (existingLike) {
      return { message: 'User already liked this content' };
    }
    let fomattedTime = await this.ACTION.formatTime(time);
    const newLike = new this.likeModel({
      userId,
      contentId,
      time: fomattedTime,
    });

    await newLike.save();
    return { message: 'Like added successfully', newLike };
  }
}
