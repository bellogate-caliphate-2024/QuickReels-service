import { BadRequestException, Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { format } from 'date-fns';
import { UpdateUserDto } from 'src/dto/updateDto';

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
    try {
      return this.userModel.findOne({ email });
    } catch (error) {
      throw new Error(`Failed to fetch users with ${email}`);
    }
  }

  async countAll(): Promise<number> {
    try {
      return this.userModel.countDocuments().exec();
    } catch (error) {
      throw new Error('Failed to count all');
    }
  }

  async deleteById(id: string): Promise<User> {
    try {
      const user = await this.userModel.findByIdAndDelete({id});
      console.log(user);
      
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error(`Failed to delete user`);
    }

  }

  async getUserVideos(email: string): Promise<string> {
    try {
      const user = await this.userModel
        .find({ email })
        .findOne({ email })
        .populate('video_url')
        .exec();

      if (!user) {
        throw new Error(`User with ${email} not found`);
      }

      const userVideos = user.video_url; 
      return userVideos;
    } catch (error) {
      throw new Error('Failed to get user videos');
    }
  }


  async getAllVideos(): Promise<string> {
    try {
      // Fetch all users from the database
      const users = await this.userModel.find().select('video_url').exec();
      console.log(users);

      // Extract video URLs from each user and join them into a single string
      const videoUrls = users.map((user) => user.video_url.toString());

      // Return the array of video URLs
      return videoUrls.join(" , ");
    } catch (error) {
      // Handle any errors that occur during the fetch operation
      console.error('Error fetching all videos:', error);
      throw new Error('Failed to fetch all videos');
    }
  }

  async updateUser(id: string, updateUserDto: CreateUserDto): Promise<User> {
    let user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new Error(`User with email ${id} not found`);
    }

    // Update user properties
    user.email = updateUserDto.email || user.email;
    user.video_url = updateUserDto.video_url ||  user.video_url;
    user.thumbnail = updateUserDto.thumbnail || user.thumbnail;
    user.caption = updateUserDto.caption || user.caption;


  //   if (!Array.isArray(user.video_url)) {
  //     user.video_url = [user.video_url];
  // }


    // Save updated user
    const updatedUser = await user.save();
    return updatedUser;
  }

  async updateUserFields(id: string, updateDto: UpdateUserDto): Promise<User> {
    try {
      return this.userModel
        .findByIdAndUpdate(id, updateDto, { new: true })
        .exec();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
