import { Controller, Post, Body, UseGuards, Delete, Get, Param, Query } from '@nestjs/common';
import { LikeService } from '../services/likes.service';
import { CreateLikeDto } from '../dtos/likes.dto';
import { JwtAuthGuard } from '../../auth/guards/auth.guards';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Likes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @ApiOperation({ summary: 'Like content' })
  @ApiResponse({ status: 201, description: 'Like created successfully' })
  async likeContent(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.createLike(createLikeDto);
  }

  @Delete(':userEmail/:contentId')
  @ApiOperation({ summary: 'Unlike content' })
  @ApiParam({ name: 'userEmail', description: 'Email of the user' })
  @ApiParam({ name: 'contentId', description: 'ID of the content' })
  @ApiResponse({ status: 200, description: 'Like removed successfully' })
  async unlikeContent(
    @Param('userEmail') userEmail: string,
    @Param('contentId') contentId: string,
  ) {
    return this.likeService.removeLike(userEmail, contentId);
  }

  @Get('count/:contentId')
  @ApiOperation({ summary: 'Get likes count for content' })
  @ApiParam({ name: 'contentId', description: 'ID of the content' })
  @ApiResponse({ status: 200, description: 'Returns the number of likes' })
  async getLikesCount(@Param('contentId') contentId: string) {
    return this.likeService.getLikesCount(contentId);
  }

  @Get('content/:contentId')
  @ApiOperation({ summary: 'Get all likes for content' })
  @ApiParam({ name: 'contentId', description: 'ID of the content' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Returns list of likes' })
  async getContentLikes(
    @Param('contentId') contentId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.likeService.getContentLikes(contentId, page, limit);
  }

  @Get('check/:userEmail/:contentId')
  @ApiOperation({ summary: 'Check if user has liked content' })
  @ApiParam({ name: 'userEmail', description: 'Email of the user' })
  @ApiParam({ name: 'contentId', description: 'ID of the content' })
  @ApiResponse({ status: 200, description: 'Returns whether user has liked the content' })
  async checkUserLike(
    @Param('userEmail') userEmail: string,
    @Param('contentId') contentId: string,
  ) {
    return this.likeService.checkUserLike(userEmail, contentId);
  }

  @Get('user/:userEmail')
  @ApiOperation({ summary: 'Get all likes by user' })
  @ApiParam({ name: 'userEmail', description: 'Email of the user' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'Returns list of content liked by user' })
  async getUserLikes(
    @Param('userEmail') userEmail: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.likeService.getUserLikes(userEmail, page, limit);
  }
}
