import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../Schemas/posts.schema';
import { CreatePostDto } from '../posts.dto';
import { Helper } from '../helpers/helper';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<Post>,
    private ACTION: Helper,
  ) {}

  async createPost(
    videoFile: Express.Multer.File,
    createDto: CreatePostDto,
  ): Promise<any> {
    const tempDir = path.join(__dirname, 'tmp');
    let videoFilePath: string;
    let thumbnailPath: string;

    try {
      // 1. Handle video file operations
      videoFilePath = this.ACTION.saveTempFile(
        videoFile.buffer,
        `video-${Date.now()}_${uuidv4()}_${videoFile.originalname}`,
      );
      const videoUrl = await this.ACTION.uploadVideoToFirebase(
        videoFile,
        videoFilePath,
      );

      // 2. Generate and handle thumbnail
      thumbnailPath = await this.ACTION.generateThumbnail(
        videoFilePath,
        tempDir,
      );
      const thumbnailUrl =
        await this.ACTION.uploadThumbnailToFirebase(thumbnailPath);

      // 3. Update DTO with URLs
      const updatedDto = this.ACTION.updateDtoWithUrls(
        createDto,
        videoUrl,
        thumbnailUrl,
      );

      // 4. Save to database
      const newUser = await this.ACTION.saveToDatabase(updatedDto);

      return {
        message:
          'User video and thumbnail successfully uploaded and stored in Firebase and MongoDB',
        newUser,
      };
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Failed to upload video');
    }
  }

  async getContents(email: string, page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      // Fetch all posts, retrieving video_url, email, and Ismock fields
      const posts = await this.postModel
        .find({}, { video_url: 1, email: 1, Ismock: 1, _id: 0 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();

      // Separate the posts based on the Ismock field
      const mockVideos: { [key: string]: string }[] = [];
      const regularVideos: { [key: string]: string }[] = [];

      posts.forEach((post) => {
        // Ensure video_url is an array, then add each URL separately
        post.video_url.forEach((video: string) => {
          if (post.Ismock) {
            mockVideos.push({ [post.email]: video });
          } else {
            regularVideos.push({ [post.email]: video });
          }
        });
      });

      // Now alternate between the mock and regular videos
      const videos: { [key: string]: string }[] = [];

      let i = 0;
      let j = 0;

      // Alternate between mock and regular videos
      while (i < mockVideos.length || j < regularVideos.length) {
        if (i < mockVideos.length) {
          videos.push(mockVideos[i++]);
        }
        if (j < regularVideos.length) {
          videos.push(regularVideos[j++]);
        }
      }

      // Calculate total number of videos
      const totalVideos = videos.length;
      console.log(videos);

      return {
        currentPage: page,
        totalPages: Math.ceil(totalVideos / limit),
        totalVideos,
        videos,
      };
    } catch (error) {
      throw new Error('Failed to retrieve contents');
    }
  }
}
