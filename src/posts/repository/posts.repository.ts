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
    return this.postModel.find().exec();
  }

  async findById(postId: string): Promise<Post | null> {
    return this.postModel.findById(postId).exec();
  }

  async findAds(): Promise<Post[]> {
    return (await this.postModel.find({ isAd: true }).exec()) ?? [];
  }
}
