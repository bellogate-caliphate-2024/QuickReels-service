// src/posts/post.controller.ts
import {
    Controller,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
    HttpCode,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { CreatePostDto } from './dto/create-post.dto';
  import { PostsService } from './posts.service';
  
  @Controller('posts')
  export class PostsController {
    constructor(private readonly postService: PostsService) {}
  
    @Post('create_post')
    @HttpCode(201) // 201 Created
    @UseInterceptors(FileInterceptor('video'))
    async createPost(
      @UploadedFile() videoFile: Express.Multer.File,
      @Query() createPostDto: CreatePostDto,
    ) {
      if (!videoFile) {
        throw new BadRequestException('No video file uploaded');
      }
        return this.postService.createPost(videoFile, createPostDto);
    }
  }