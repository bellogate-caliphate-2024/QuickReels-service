import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
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
    return this.followerModel
      .findOne(this.getFollowFilter(followerEmail, followingEmail))
      .exec();
  }

  async deleteFollow(
    followerEmail: string,
    followingEmail: string,
  ): Promise<boolean> {
    const result = await this.followerModel
      .deleteOne(this.getFollowFilter(followerEmail, followingEmail))
      .exec();
    return result.deletedCount > 0;
  }

  async getFollowersCount(userEmail: string): Promise<number> {
    return this.countBy({ followingEmail: userEmail });
  }

  async getFollowingCount(userEmail: string): Promise<number> {
    return this.countBy({ followerEmail: userEmail });
  }

  async getAllFollowers(userEmail: string): Promise<Follower[]> {
    return this.findBy({ followingEmail: userEmail });
  }

  async getAllFollowing(userEmail: string): Promise<Follower[]> {
    return this.findBy({ followerEmail: userEmail });
  }

  async getAllFollowRelationships(): Promise<Follower[]> {
    return this.followerModel.find().exec();
  }

  private getFollowFilter(
    followerEmail: string,
    followingEmail: string,
  ): FilterQuery<Follower> {
    return { followerEmail, followingEmail };
  }

  private findBy(filter: FilterQuery<Follower>): Promise<Follower[]> {
    return this.followerModel.find(filter).exec();
  }

  private countBy(filter: FilterQuery<Follower>): Promise<number> {
    return this.followerModel.countDocuments(filter).exec();
  }
}
