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
  @UseInterceptors(FileInterceptor('videoFile'))
  async createPost(
    @UploadedFile() videoFile: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @Query('userProfilePicture') userProfilePicture: string,
    @Query('numberOfViews') numberOfViews: number,
    @Query('numberOfLikes') numberOfLikes: number,
    @Query('numberOfComments') numberOfComments: number,
  ): Promise<any> {
    if (!videoFile) {
      throw new BadRequestException('No video file uploaded');
    }

    createPostDto.userProfilePicture = userProfilePicture;
    createPostDto.numberOfViews = Number(numberOfViews);
    createPostDto.numberOfLikes = Number(numberOfLikes);
    createPostDto.numberOfComments = Number(numberOfComments);

    return this.postService.createPost(videoFile, createPostDto);
  }

  @Get('getContents')
  async getContents(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.postService.getContents(Number(page), Number(limit));
  }
}
