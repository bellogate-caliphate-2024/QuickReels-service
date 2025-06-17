import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follower } from '../models/followers.schema';
import { CreateFollowerDto } from '../dtos/followers.dto';

@Injectable()
export class FollowersRepository {
  constructor(
    @InjectModel(Follower.name) private readonly followerModel: Model<Follower>,
  ) {}

  async createFollow(createFollowerDto: CreateFollowerDto): Promise<Follower> {
    const newFollow = new this.followerModel(createFollowerDto);
    return newFollow.save();
  }

  async findFollow(
    followerEmail: string,
    followingEmail: string,
  ): Promise<Follower | null> {
    return this.followerModel.findOne({ followerEmail, followingEmail }).exec();
  }

  async deleteFollow(
    followerEmail: string,
    followingEmail: string,
  ): Promise<boolean> {
    const result = await this.followerModel
      .deleteOne({ followerEmail, followingEmail })
      .exec();
    return result.deletedCount > 0;
  }

  async getFollowersCount(userEmail: string): Promise<number> {
    return this.followerModel
      .countDocuments({ followingEmail: userEmail })
      .exec();
  }

  async getFollowingCount(userEmail: string): Promise<number> {
    return this.followerModel
      .countDocuments({ followerEmail: userEmail })
      .exec();
  }

  async getAllFollowers(userEmail: string): Promise<Follower[]> {
    return this.followerModel.find({ followingEmail: userEmail }).exec();
  }

  async getAllFollowing(userEmail: string): Promise<Follower[]> {
    return this.followerModel.find({ followerEmail: userEmail }).exec();
  }

  async getAllFollowRelationships(): Promise<Follower[]> {
    return this.followerModel.find().exec();
  }
}
