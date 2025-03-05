import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from '../posts.dto';
import { Helper } from '../helpers/helper';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { format } from 'date-fns';
import { AwsS3Service } from '../DataBase/Aws';
@Injectable()
export class PostsService {
  logger: Logger;
  constructor(
    private readonly ACTION: Helper,
    private readonly awsS3Service: AwsS3Service,
  ) {
    this.logger = new Logger(PostsService.name);
  }

  async createPost(
    videoFile: Express.Multer.File,
    createDto: CreatePostDto,
  ): Promise<any> {
    const tempDir = path.join(__dirname, 'tmp');
    let videoFilePath: string;
    let thumbnailPath: string;

    try {
      videoFilePath = await this.ACTION.saveTempFile(
        videoFile.buffer,
        `video-${Date.now()}_${uuidv4()}_${videoFile.originalname}`,
      );

      thumbnailPath = await this.ACTION.generateThumbnail(
        videoFilePath,
        tempDir,
      );

      const formattedTime = format(new Date(), 'MM/dd/yyyy');

      const updatedDto = {
        ...createDto,
        time: formattedTime,
      };

      const newUser = await this.ACTION.saveToDatabase(updatedDto);

      return {
        message:
          'User video, thumbnail, and profile picture successfully uploaded and stored in AWS S3 and MongoDB',
        newUser,
      };
    } catch (error) {
      throw new Error('Failed to upload video');
    }
  }

  async getContents(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;

      const posts = await this.ACTION.fetchAllPosts();
      this.logger.log(posts);
      const alternatedPosts = this.ACTION.alternateMockPosts(posts);
      const allVideos = this.ACTION.flattenVideos(alternatedPosts);
      const paginatedVideos = allVideos.slice(skip, skip + limit);

      const isLastPage = skip + limit >= allVideos.length;
      return {
        currentPage: page,
        listOfContents: paginatedVideos,
        isLastPage,
        nextPage: isLastPage ? null : page + 1,
      };
    } catch (error) {
      throw new Error('Failed to retrieve contents');
    }
  }
}
