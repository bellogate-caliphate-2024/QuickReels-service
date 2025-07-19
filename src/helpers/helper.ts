import {
  BadRequestException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../posts/models/posts.schema';
import * as path from 'path'; 
import * as fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import * as ffmpegStatic from '@ffmpeg-installer/ffmpeg';
import * as ffprobeStatic from '@ffprobe-installer/ffprobe';
import { format } from 'date-fns';

@Injectable()
export class DatabaseHelper {
  @InjectModel(Post.name) private postModel: Model<Post>;
  constructor() {}

  async saveToDatabase(postData: Partial<Post>) {
    try {
      const createdPost = new this.postModel(postData);
      console.log('createdPost', createdPost);

      return await createdPost.save();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async handleError(error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message,
      );
      throw new BadRequestException(messages);
    }

    if (error.name === 'MongoNetworkError') {
      throw new InternalServerErrorException('Database connection failed');
    }

    throw new InternalServerErrorException('Failed to create post');
  }

  async saveTempFile(buffer: Buffer, filename: string): Promise<string> {
    const tempDir = path.join(__dirname, 'tmp');

    try {
      await fs.promises.mkdir(tempDir, { recursive: true });

      const filePath = path.join(tempDir, filename);

      await fs.promises.writeFile(filePath, buffer);

      return filePath;
    } catch (error) {
      throw new Error('Failed to save temporary file');
    }
  }

  async generateThumbnail(videoPath: string, tempDir: string): Promise<string> {
    const thumbnailFileName = `thumbnail-${Date.now()}.png`;
    const thumbnailPath = path.join(tempDir, thumbnailFileName);

    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .setFfmpegPath(ffmpegStatic.path)
        .setFfprobePath(ffprobeStatic.path)
        .on('end', resolve)
        .on('error', reject)
        .screenshots({
          timestamps: ['50%'],
          filename: thumbnailFileName,
          folder: tempDir,
          size: '320x240',
        });
    });

    return thumbnailPath;
  }

  async fetchAllPosts() {
    return this.postModel
      .find(
        {},
        {
          video_url: 1,
          thumbnail: 1,
          caption: 1,
          time: 1,
          numberOfViews: 1,
          numberOfLikes: 1,
          numberOfComments: 1,
          email: 1,
          userName: 1,
          userProfilePicture: 1,
          isLiked: 1,
          Ismock: 1,
        },
      )
      .lean()
      .exec();
  }

  flattenVideos(posts: any[]): any[] {
    const allVideos: any[] = [];
    posts.forEach((post) => {
      post.video_url?.forEach((video: string, index: number) => {
        allVideos.push({
          id: `content-${post._id}-${index}`,
          videoUrl: video,
          thumbnailUrl: post.thumbnail?.[index] || '',
          caption: post.caption || '',
          date: post.time
            ? new Date(post.time).toISOString().split('T')[0]
            : '',
          numberOfViews: post.numberOfViews || 0,
          numberOfLikes: post.numberOfLikes || 0,
          numberOfComments: post.numberOfComments || 0,
          userId: post.email,
          userName: post.userName || 'Unknown',
          userProfilePicture: post.userProfilePicture || '',
          isLiked: post.isLiked || false,
          Ismock: post.Ismock || false,
        });
      });
    });
    return allVideos;
  }

  alternateMockPosts(posts: any[]): any[] {
    const mockPosts = posts.filter((post) => post.Ismock);
    const nonMockPosts = posts.filter((post) => !post.Ismock);

    const alternatedPosts: any[] = [];
    let i = 0,
      j = 0;

    while (i < mockPosts.length || j < nonMockPosts.length) {
      if (i < mockPosts.length) alternatedPosts.push(mockPosts[i++]);
      if (j < nonMockPosts.length) alternatedPosts.push(nonMockPosts[j++]);
    }

    return alternatedPosts;
  }

  formatTime(time?: string | Date): string {
    return format(time ? new Date(time) : new Date(), 'EEE HH:mm MMMM yyyy');
  }

  async randomizeADs(posts: Post[], ads: Post[]) {
    if (ads.length === 0) return posts;

    const mixedContent: Post[] = [...posts];
    const shuffledAds = this.shuffleArray(ads);

    let adIndex = 0;
    let i = 0;

    while (adIndex < (await shuffledAds).length && i < mixedContent.length) {
      if (Math.random() < 0.5) {
        mixedContent.splice(i, 0, shuffledAds[adIndex]);
        adIndex++;
      }
      i++;
    }
    while (adIndex < (await shuffledAds).length) {
      mixedContent.push(shuffledAds[adIndex]);
      adIndex++;
    }

    return mixedContent;
  }

  async shuffleArray<T>(array: T[]): Promise<T[]> {
    return array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }
}
 