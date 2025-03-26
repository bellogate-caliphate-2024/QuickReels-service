import { Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from '../dtos/posts.dto';
import { PostsRepository } from '../repository/posts.repository';
import { format } from 'date-fns';
import { AwsS3Service } from '../../DataBase/Aws';
import eleasticClient from '../../config/elasticsearch.client';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly awsS3Service: AwsS3Service,
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

  async getContents() {
    try {
      return await this.postsRepository.getAllPosts();
    } catch (error) {
      throw new Error('Failed to retrieve contents');
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
}
