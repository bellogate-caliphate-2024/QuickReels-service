import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  HttpCode,
  Body,
  Get,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from '../dtos/posts.dto';
import { PostsService } from '../services/posts.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guards';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post('create_post')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('videoFile'))
  async createPost(
    @UploadedFile() videoFile: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @Query('numberOfViews') numberOfViews: number,
    @Query('numberOfLikes') numberOfLikes: number,
    @Query('numberOfComments') numberOfComments: number,
  ): Promise<any> {
    if (!videoFile) {
      throw new BadRequestException('No video file uploaded');
    }

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
    return this.postService.getContents(page, limit);
  }

  @Get('search')
  async searchPosts(@Query('query') query: string) {
    return this.postService.searchPosts(query);
  }

  @Get('ads')
  async getAds(): Promise<{ videoUrl: string; isAd: boolean }[]> {
    return this.postService.getAds();
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    return this.postService.deleteContent(id);
  }
}
