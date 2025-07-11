import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserProgress } from '../models/user-progress.schema';

@Injectable()
export class UserProgressRepository {
  constructor(
    @InjectModel(UserProgress.name)
    private readonly userProgressModel: Model<UserProgress>,
  ) {}

  async findByUserId(userId: string): Promise<UserProgress | null> {
    return this.userProgressModel.findOne({ userId }).exec();
  }

  async upsertProgress(userId: string, postId: string, postCaption?: string): Promise<UserProgress> {
    return this.userProgressModel.findOneAndUpdate(
      { userId },
      { postId, postCaption },
      { new: true, upsert: true },
    ).exec();
  }
} 