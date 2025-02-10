import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../Schemas/posts.schema';
import { CreatePostDto } from '../posts.dto';
import { Helper } from '../helpers/helper';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
    private ACTION: Helper,
  ) {}

  // async createPost(
  //   videoFile: Express.Multer.File,
  //   createDto: CreatePostDto,
  // ): Promise<any> {
  //   const tempDir = path.join(__dirname, 'tmp');
  //   let videoFilePath: string;
  //   let thumbnailPath: string;

  //   try {
  //     // 1. Handle video file operations
  //     videoFilePath = this.ACTION.saveTempFile(
  //       videoFile.buffer,
  //       `video-${Date.now()}_${uuidv4()}_${videoFile.originalname}`,
  //     );
  //     const videoUrl = await this.ACTION.uploadVideoToFirebase(
  //       videoFile,
  //       videoFilePath,
  //     );

  //     // 2. Generate and handle thumbnail
  //     thumbnailPath = await this.ACTION.generateThumbnail(
  //       videoFilePath,
  //       tempDir,
  //     );
  //     const thumbnailUrl =
  //       await this.ACTION.uploadThumbnailToFirebase(thumbnailPath);

  //     // 3. Update DTO with URLs
  //     const updatedDto = this.ACTION.updateDtoWithUrls(
  //       createDto,
  //       videoUrl,
  //       thumbnailUrl,
  //     );

  //     // 4. Save to database
  //     const newUser = await this.ACTION.saveToDatabase(updatedDto);

  //     return {
  //       message:
  //         'User video and thumbnail successfully uploaded and stored in Firebase and MongoDB',
  //       newUser,
  //     };
  //   } catch (error) {
  //     console.error('Error uploading video:', error);
  //     throw new Error('Failed to upload video');
  //   }
  // }
}
