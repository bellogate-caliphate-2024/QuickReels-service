import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from '../models/likes.schema';
import { CreateLikeDto } from '../dtos/likes.dto';

@Injectable()
export class LikeRepository {
  constructor(@InjectModel(Like.name) private readonly likeModel: Model<Like>) {}

  async findLike(userId: string, contentId: string): Promise<Like | null> {
    return this.likeModel.findOne({ userId, contentId }).exec();
  }

  async createLike(createLikeDto: CreateLikeDto): Promise<Like> {
    const newLike = new this.likeModel(createLikeDto);
    return newLike.save();
  }
}
