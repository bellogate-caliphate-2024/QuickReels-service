import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreatePostDto } from '../dtos/posts.dto';
import { PostsRepository } from '../repository/posts.repository';
import { format } from 'date-fns';
import { AwsS3Service } from '../../DataBase/Aws';
import eleasticClient from '../../config/elasticsearch.client';
import { DatabaseHelper } from '../../helpers/helper';
import * as path from 'path';
import * as fs from 'fs';
import { UpdatePostDto } from '../dtos/update-post.dto';

@Injectable()
export class PostsService {

  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly awsS3Service: AwsS3Service,
    private readonly dataBaseHelper: DatabaseHelper,
  ) {
  }

  async createPost(
    videoFile: Express.Multer.File,
    createDto: CreatePostDto,
  ): Promise<any> {
    const tempDir = path.join(__dirname, 'tmp');
    let videoFilePath: string;
    let thumbnailPath: string;

    try {
      videoFilePath = await this.dataBaseHelper.saveTempFile(
        videoFile.buffer,
        `video-${Date.now()}_${uuidv4()}_${videoFile.originalname}`,
      );

      const videoUrl = await this.awsS3Service.uploadFile(videoFile, 'videos');

      thumbnailPath = await this.dataBaseHelper.generateThumbnail(
        videoFilePath,
        tempDir,
      );

      const thumbnailFile = {
        buffer: await fs.promises.readFile(thumbnailPath),
        originalname: path.basename(thumbnailPath),
        mimetype: 'image/png',
      } as Express.Multer.File;

      const thumbnailUrl = await this.awsS3Service.uploadFile(
        thumbnailFile,
        'thumbnails',
      );

      if (!createDto.email) {
        throw new NotFoundException('Please enter your email to post content');
      }

      const formattedTime = format(new Date(), 'MM/dd/yyyy HH:mm a');

      const newPost = await this.postsRepository.createPost({
        email: createDto.email,
        userName: createDto.userName,
        caption: createDto.caption,
        video_url: videoUrl,
        thumbnail: thumbnailUrl,
        Ismock: createDto.Ismock,
        time: createDto.time || formattedTime,
        numberOfViews: 0,
        numberOfLikes: 0,
        numberOfComments: 0,
      });

      return {
        message: 'Video and thumbnail successfully uploaded and stored.',
        newPost,
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to upload video');
    }
  }


  async getContents(page: number, limit: number) {
    page = page || 1;
    limit = limit || 10;

    try {
      const [allPosts, allAds] = await Promise.all([
        this.postsRepository.getAllPosts() || [],
        this.postsRepository.findAds() || [],
      ]);

      const allContent = await this.dataBaseHelper.randomizeADs(
        allPosts,
        allAds,
      );
      const totalItems = allContent.length;

      const totalPages = Math.ceil(totalItems / limit);
      const currentPage = Math.max(1, Math.min(page, totalPages));
      const startIndex = (currentPage - 1) * limit;
      const endIndex = Math.min(startIndex + limit, totalItems);

      const pageContent = allContent.slice(startIndex, endIndex);

      return {
        currentPage: currentPage,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        isLastPage: currentPage >= totalPages,
        totalItems: totalItems,
        listOfContents: pageContent,
      };
    } catch (error) {
      throw new Error('Failed to load content. Please try again later.');
    }
  }


  async searchPosts(query: string) {
    try {
      if (!query.trim()) {
        return { message: 'Search query cannot be empty', results: [] };
      }

      const { hits } = await eleasticClient.search({
        index: 'quickreels',
        query: {
          match: { title: query },
        },
      });

      if (!hits.hits.length) {
        return { message: 'No matching posts found', results: [] };
      }

      return hits.hits.map((hit) => hit._source);
    } catch (error) {
      throw new Error('Failed to search posts');
    }
  }

  async updatePost(id: string, updateDto: UpdatePostDto) {
    return this.postsRepository.findByIdAndUpdate(id, updateDto);
  }

  async getPostncrementViewCount(id: string) {
    const post = await this.postsRepository.findByIdAndUpdate(
      id,
      { $inc: { numberOfViews: 1 } } as any,
    );
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async getAds(): Promise<{ videoUrl: string; isAd: boolean }[]> {
    return await this.postsRepository.getAds();
  }


  async deleteContent(id: string): Promise<{ message: string }> {
    const result = await this.postsRepository.deleteById(id);
    if (!result) {
      throw new NotFoundException('Content not found');
    }
    return { message: 'Content deleted successfully' };
  }

}
