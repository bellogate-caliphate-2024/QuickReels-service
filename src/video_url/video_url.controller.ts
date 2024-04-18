import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { VideosService } from './video_url.service';
import { UpdateVideo_urlDto } from 'src/dto/updateDto';
import { CreateVideoDto } from 'src/dto/video_url.dto';
import { Video_Url } from './video_url.schema';
@Controller('api/v1/production')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post('post_video')
  async createUserWithVideo(
    @Body() createVideo_urlDTO: CreateVideoDto,
  ): Promise<Video_Url> {
    try {
      const user = this.videosService.postVideo(createVideo_urlDTO);
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  @Get('/get_content')
  async getContent(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<{
    data: Video_Url[];
    page: number;
    limit: number;
    totalUsers: number;
    totalPages: number;
  }> {
    return this.videosService.getContent(page, limit);
  }

  @Get('/videos')
  async getAllVideos(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.videosService.getAllVideos(page, limit);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<void> {
    const deletedUser = await this.videosService.deleteVideo(id);
    if (!deletedUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    return deletedUser;
  }

  @Patch('edit_post/:id')
  async updateUserFields(
    @Param('id') id: string,
    @Body() updateDto: UpdateVideo_urlDto,
  ) {
    try {
      return this.videosService.updateFields(id, updateDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
