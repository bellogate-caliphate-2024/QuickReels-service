// src/posts/post.controller.ts
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


    @Delete('/deletevideo/:email')
    async deletePost(
      @Param('email') email: string,
      @Body('video_url') videoUrl: string,
    ) {
      try {
        return await this.postService.deletePost(email, videoUrl);
      } catch (error) {
        console.error(error.message);
        throw new Error('Failed to delete video URL from user');
      }
    }
  
    
  }