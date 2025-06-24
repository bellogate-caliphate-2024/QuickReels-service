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
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';

import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from '../dtos/posts.dto';
import { PostsService } from '../services/posts.service';
import { JwtAuthGuard } from '../../auth/guards/auth.guards';
import { UpdatePostDto } from '../dtos/update-post.dto';
@ApiTags('Posts')
// @UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post('create_post')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('videoFile'))
  @ApiOperation({ summary: 'Create a post with video upload' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Form data with video file and post details',
    type: CreatePostDto,
  })
  @ApiQuery({ name: 'numberOfViews', required: false })
  @ApiQuery({ name: 'numberOfLikes', required: false })
  @ApiQuery({ name: 'numberOfComments', required: false })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
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
  @ApiOperation({ summary: 'Get paginated contents' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getContents(@Query('page') page: number, @Query('limit') limit: number) {
    return this.postService.getContents(page, limit);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search posts by keyword' })
  @ApiQuery({ name: 'query', required: true })
  async searchPosts(@Query('query') query: string) {
    return this.postService.searchPosts(query);
  }


  @Get('ads')
  @ApiOperation({ summary: 'Fetch ads' })
  async getAds(): Promise<{ videoUrl: string; isAd: boolean }[]> {
    return this.postService.getAds();
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID and increment view count' })
  @ApiParam({ name: 'id', description: 'ID of the post to retrieve' })
  async getPostncrementViewCount(@Param('id') id: string) {
    return this.postService.getPostncrementViewCount(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post by ID' })
  @ApiBody({ type: UpdatePostDto })
  @ApiResponse({ status: 200, description: 'Post updated successfully' })
  async updatePost(@Param('id') id: string, @Body() updateDto: UpdatePostDto) {
    return this.postService.updatePost(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiParam({ name: 'id', description: 'ID of the post to delete' })
  async deletePost(@Param('id') id: string) {
    return this.postService.deleteContent(id);
  }
}