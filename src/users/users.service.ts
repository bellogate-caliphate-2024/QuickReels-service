import { BadRequestException, Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { format } from 'date-fns';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: mongoose.Model<User>) {}

  async createUserWithVideo(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Check if video file is provided
      if (!createUserDto) {
        throw new BadRequestException('No user data added');
      }
      const formattedTime = format(new Date(), 'EEE do MMM yyyy h:mm a');

      createUserDto.time = formattedTime;

      // Create a new user object using the createUserDto data
      const newUser = new CreateUserDto(
        createUserDto.time,
        createUserDto.email,
        createUserDto.video_url,
        createUserDto.thumbnail,
        createUserDto.caption,
      );

      const createdUser = await this.userModel.create(newUser);
      await createdUser.save();
      console.log(createdUser);
      
      return createdUser;
    } catch (error) {
      console.log(error);

      throw new Error('Failed to create user');
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: User[];
    page: number;
    limit: number;
    totalUsers: number;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;
      const users = await this.userModel.find().skip(skip).limit(limit).exec();
      const totalUsers = await this.userModel.countDocuments().exec();
      const totalPages = Math.ceil(totalUsers / limit);

      return {
        data: users,
        page,
        limit,
        totalUsers,
        totalPages,
      };
    } catch (error) {
      console.error('Error with pagination query', error);
      throw new Error('Failed to fetch users');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async countAll(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  async deleteById(email: string): Promise<User> {
    const deletedUser = await this.userModel.findByIdAndDelete(email).exec();
    if (!deletedUser) {
      throw new Error('User not found');
    }

    return deletedUser;
  }

  async getUserVideos(email: string): Promise<string[]> {
    try {
      const user = await this.userModel
        .findOne({ email })
        .populate('video_url')
        .exec();

      if (!user) {
        throw new Error(`User with ${email} not found`);
      }

      const userVideos = user.video_url; // Assuming video_url holds an array of video URLs 
      return userVideos;
    } catch (error) {
      throw new Error('Failed to get user videos');
    }
  }

  async getAllVideos(): Promise<string> {
    try {
      const arr = []
      const users = await this.userModel.find().exec();
      console.log(users);
      
      const videoUrls = users.map(user => user.video_url.toString()).join('');
      console.log(videoUrls);
     
      return   videoUrls;
    } catch (error) {
      console.error('Error fetching all videos:', error);
      throw new Error('Failed to fetch all videos');
    }
  }
}
