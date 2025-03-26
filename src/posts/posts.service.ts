import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from '../dtos/posts.dto';
import { DatabaseHelper } from '../helpers/helper';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { format } from 'date-fns';
import { AwsS3Service } from '../DataBase/Aws';
import { Like } from '../Schemas/likes.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import elasticsearchClient from 'src/config/elasticsearch.client';

@Injectable()
export class PostsService {
  logger: Logger;
  constructor(
    private readonly ACTION: DatabaseHelper,
    private readonly awsS3Service: AwsS3Service,
    @InjectModel(Like.name) private readonly likeModel: Model<Like>,
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
    let videoUrl: string;
    let thumbnailUrl: string;

    try {

      videoUrl = await this.awsS3Service.uploadFile(videoFile, 'videos');

      videoFilePath = await this.ACTION.saveTempFile(
        videoFile.buffer,
        `video-${Date.now()}_${uuidv4()}_${videoFile.originalname}`,
      );

      thumbnailPath = await this.ACTION.generateThumbnail(
        videoFilePath,
        tempDir,
      );
      
      thumbnailUrl = await this.awsS3Service.uploadLocalFile(thumbnailPath, 'thumbnails');

      const formattedTime = format(new Date(), 'MM/dd/yyyy');

      const updatedDto = {
        ...createDto,
        time: formattedTime,
      };

      const newUser = await this.ACTION.saveToDatabase(updatedDto);
      
      await elasticsearchClient.index({
        index: 'quickreels',
        id: newUser._id.toString(),
        document: {
          title: createDto.caption,
          uploader: createDto.userName,
          upload_date: new Date(),
        },
      });
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


  async searchPosts(query: string) {
    try {
      const { hits } = await elasticsearchClient.search({
        index: 'quickreels',
        query: {
          match: { title: query },
        },
      });

      return hits.hits.map((hit) => hit._source);
    } catch (error) {
      throw new Error('Failed to search posts');
    }
  }
}
