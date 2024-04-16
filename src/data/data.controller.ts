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
import { VideosService } from './data.service';
import { User } from 'src/users/users.schema';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { UpdateUserDto } from 'src/dto/updateDto';

@Controller('post')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post('post_video')
  async createUserWithVideo(
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    try {
      const user = this.videosService.postVideo(createUserDto);
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
    data: User[];
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
    @Body() updateDto: UpdateUserDto,
  ) {
    try {
      return this.videosService.updateFields(id, updateDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
