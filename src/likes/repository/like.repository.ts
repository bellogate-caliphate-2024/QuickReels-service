import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from '../models/likes.schema';
import { CreateLikeDto } from '../dtos/likes.dto';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectModel(Like.name) private readonly likeModel: Model<Like>,
  ) {}

  async findLike(userEmail: string, contentId: string): Promise<Like | null> {
    return this.likeModel.findOne({ userEmail, contentId }).exec();
  }

  async createLike(createLikeDto: CreateLikeDto): Promise<Like> {
    const newLike = new this.likeModel(createLikeDto);
    return newLike.save();
  }

  async deleteLike(userEmail: string, contentId: string): Promise<boolean> {
    const result = await this.likeModel.deleteOne({ userEmail, contentId }).exec();
    return result.deletedCount > 0;
  }

  async getLikesCount(contentId: string): Promise<number> {
    return this.likeModel.countDocuments({ contentId }).exec();
  }

  async getContentLikes(contentId: string, skip: number, limit: number): Promise<Like[]> {
    return this.likeModel
      .find({ contentId })
      .sort({ time: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async getUserLikes(userEmail: string, skip: number, limit: number): Promise<Like[]> {
    return this.likeModel
      .find({ userEmail })
      .sort({ time: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async getUserLikesCount(userEmail: string): Promise<number> {
    return this.likeModel.countDocuments({ userEmail }).exec();
  }
}
