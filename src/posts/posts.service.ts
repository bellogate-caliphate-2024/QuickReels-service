import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../Schemas/posts.schema';
import { CreatePostDto } from '../posts.dto';
import { Helper } from '../helpers/helper';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { format } from 'date-fns';

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

      // 4. Store userProfilePicture
      const profilePictureUrl = createDto.userProfilePicture;

      // Edit time format
      createDto.time = new Date().toISOString();
      const formattedTime = format(new Date(createDto.time), 'MM/dd/yyyy');
      createDto.time = formattedTime;
      // 5. Update DTO with URLs
      const updatedDto = {
        ...createDto,
        video_url: [videoUrl],
        thumbnail: [thumbnailUrl],
        userProfilePicture: profilePictureUrl, // Ensure it's added to the DTO
      };

      // 6. Save to database
      const newUser = await this.ACTION.saveToDatabase(updatedDto);

      return {
        message:
          'User video, thumbnail, and profile picture successfully uploaded and stored in Firebase and MongoDB',
        newUser,
      };
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Failed to upload video');
    }
  }

  async getContents(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;

      // Fetch all posts from the database
      const posts = await this.postModel
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

      // Flatten all videos into a single array
      const allVideos: any[] = [];
      posts.forEach((post) => {
        post.video_url?.forEach((video: string, index: number) => {
          const content = {
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
          };
          allVideos.push(content);
        });
        
      });

      // Apply pagination to the flattened videos array
      const paginatedVideos = allVideos.slice(skip, skip + limit);
      const isLastPage = skip + limit >= allVideos.length;

      return {
        currentPage: page,
        nextPage: isLastPage ? null : page + 1,
        isLastPage,
        listOfContents: paginatedVideos,
      };
    } catch (error) {
      console.error('Error retrieving contents:', error);
      throw new Error('Failed to retrieve contents');
    }
  }
}
