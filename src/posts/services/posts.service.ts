import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from '../dtos/posts.dto';
import { PostsRepository } from '../repository/posts.repository';
import { format } from 'date-fns';
import { AwsS3Service } from '../../DataBase/Aws';
import eleasticClient from '../../config/elasticsearch.client';
import { DatabaseHelper } from '../../helpers/helper';
import { Post } from '../models/posts.schema';
@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly awsS3Service: AwsS3Service,
    private readonly dataBaseHelper: DatabaseHelper,
  ) {}

  async createPost(videoFile: Express.Multer.File, createDto: CreatePostDto) {
    try {
      const videoUrl = await this.awsS3Service.uploadFile(videoFile, 'videos');

      const formattedTime = format(new Date(), 'MM/dd/yyyy');
      const updatedDto = { ...createDto, videoUrl, time: formattedTime };

      const newPost = await this.postsRepository.createPost(updatedDto);

      await eleasticClient.index({
        index: 'quickreels',
        id: newPost.id,
        document: {
          title: createDto.caption,
          uploader: createDto.userName,
          upload_date: new Date(),
        },
      });

      return {
        message: 'Post created successfully',
        newPost,
      };
    } catch (error) {
      this.logger.error('Error creating post', error);
      throw new Error('Failed to create post');
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
      this.logger.error('Error searching posts:', error);
      throw new Error('Failed to search posts');
    }
  }

  async getAds(): Promise<{ videoUrl: string; isAd: boolean }[]> {
    return await this.postsRepository.getAds();
  }
}
