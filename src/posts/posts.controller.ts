import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  HttpCode,
  Param,
  Delete,
  Body,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from '../posts.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post('create_post')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('video'))
  async createPost(
    @UploadedFile() videoFile: Express.Multer.File,
    @Query() createPostDto: CreatePostDto,
  ): Promise<any> {
    if (!videoFile) {
      throw new BadRequestException('No video file uploaded');
    }
    return this.postService.createPost(videoFile, createPostDto);
  }

  @Delete('/deletePost/:email')
  async deletePost(
    @Param('email') email: string,
    @Body('videoUrl') videoUrl: string,
  ) {
    try {
      if (!videoUrl) {
        throw new BadRequestException('No post was found');
      }
      await this.postService.deletePost(email, videoUrl);
      return { message: 'User post successfully deleted' };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
