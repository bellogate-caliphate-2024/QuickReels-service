import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './users.schema';
import { error } from 'console';
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('post_video')
  async createUserWithVideo(
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    try {
      const user = this.userService.createUserWithVideo(createUserDto);
      return user;
    } catch (error) {
      console.log(error);
    }
  }

  @Get('/')
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<{
    data: User[];
    page: number;
    limit: number;
    totalUsers: number;
    totalPages: number;
  }> {
    return this.userService.findAll(page, limit);
  }

  @Get(':email')
  async getUserById(@Param('email') email: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    return user
  }

  @Get('count')
  async countUsers(): Promise<number> {
    return this.userService.countAll();
  }
 
  @Get('/videos/:email')
  async getUserVideos(@Param('email') email: string): Promise<string[]> {
    return this.userService.getUserVideos(email);
  }

  @Get('/allv')
async getAllVideos(): Promise<string[]> {
  const allvideos = await this.userService.getAllVideos();
  console.log(allvideos);
  return allvideos.toString().split(" "); 
}
}
