import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../models/posts.schema';
import { CreatePostDto } from '../dtos/posts.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const newPost = new this.postModel(createPostDto);
    return newPost.save();
  }

  async getAllPosts(): Promise<Post[]> {
    const post = this.postModel.find().exec();
    return post;
  }

  async findById(postId: string): Promise<Post | null> {
    return this.postModel.findById(postId).exec();
  }

  async findAds(): Promise<Post[]> {
    return (await this.postModel.find({ isAd: true }).exec()) ?? [];
  }
  
  async findByIdAndUpdate(id: string, update: Partial<Post>) {
    return this.postModel.findByIdAndUpdate(id, update, { new: true });
  }
  
  async getAds(): Promise<{ videoUrl: string; isAd: boolean }[]> {
    const ads = await this.postModel
      .find({ isAd: true })
      .select('video_url')
      .lean()
      .exec();
    return ads.map((ad) => ({
      videoUrl: ad.video_url[0],
      isAd: true,
    }));
  }

  async deleteById(id: string): Promise<boolean> {
    const res = await this.postModel.findByIdAndDelete(id);
    return !!res;
  }

  async findByEmail(email: string): Promise<Post | null> {
    return this.postModel.findOne({ email }).exec();
  }

  async updatePost(post: Post): Promise<Post | null> {
    return this.postModel
      .findByIdAndUpdate(post.id, post, {
        new: true,
      })
      .exec();
  }
}
