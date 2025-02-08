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
    constructor(private readonly postService: PostsService) {   }
  
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

  }
