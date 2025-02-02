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
  import { CreatePostDto } from 'src/data/Abstarcts/posts.dto';
  import { PostsService } from './posts.service';
  @Controller('posts')
  export class PostsController {
    constructor(private readonly postService: PostsService) {}
  
    @Post('create_post')
    @HttpCode(201) // 201 Created
    // Set up the endpoint to accept: A video file (multipart/form-data)
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