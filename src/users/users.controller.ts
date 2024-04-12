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
  Patch,
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
import { UpdateUserDto } from 'src/dto/updateDto';
@Controller('users')
export class UsersController {
  private video : string[]
  constructor(private readonly userService: UsersService) {}

  @Post('create_user')
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
    return user;
  }


  @Get('count')
  async countUsers(): Promise<number> {
    try {
      return this.userService.countAll();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Get('/videos/:email')
  async getUserVideos(@Param('email') email: string): Promise<string> {
    try {
      return this.userService.getUserVideos(email);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Get('/allv')
  async getAllVideos(): Promise<string> {
    try {
      const allvideos = await this.userService.getAllVideos();
      return allvideos 
    } catch (error) {
      throw new Error(error.message);
    }
  }


  @Put(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: CreateUserDto,
  ): Promise<User> {
    try {
      const updatedUser = await this.userService.updateUser(
        userId,
        updateUserDto,
      );
      return updatedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Patch(':id')
  async updateUserFields(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
  ) {
    try {
      return this.userService.updateUserFields(id, updateDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<void> {
    const deletedUser = await this.userService.deleteById(id);
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
