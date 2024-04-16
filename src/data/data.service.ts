import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/users.schema';
import { CreateUserDto } from 'src/dto/create-user.dto';
import { format } from 'date-fns';
import { UpdateUserDto } from 'src/dto/updateDto';

@Injectable()
export class VideosService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}


async postVideo(createUserDto: CreateUserDto): Promise<User> {
  try {
    if (!createUserDto) {
      throw new Error('No data added');
    }
    const formattedTime = format(new Date(), 'EEE do MMM yyyy h:mm a');

    createUserDto.time = formattedTime;

    // Create a new user object using the createUserDto data
    const newPost = new CreateUserDto(
      createUserDto.time,
      createUserDto.email,
      createUserDto.video_url,
      createUserDto.thumbnail,
      createUserDto.caption,
    );

    const createdPost = await this.userModel.create(newPost);
    await createdPost.save();
    return createdPost;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to post video');
  }
}


async getContent(
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
    const content = await this.userModel.find().skip(skip).limit(limit).exec();
    const totalUsers = await this.userModel.countDocuments().exec();
    const totalPages = Math.ceil(totalUsers / limit);

    return {
      data: content,
      page,
      limit,
      totalUsers,
      totalPages,
    };
  } catch (error) {
    throw new Error('Failed to Get Contents');
  }
}



async getAllVideos(
  page: number = 1,
  limit: number = 10,
): Promise<{
  data: { email: string; video_url: string[]; }[];
  page: number;
  limit: number;
  totalVideos: number;
  totalPages: number;
}> {
  try {
      const skip = (page - 1) * limit;
      const videoUrls = await this.userModel.find().select('email video_url').skip(skip).limit(limit).exec();
      const totalVideos = await this.userModel.countDocuments().exec();
      const totalPages = Math.ceil(totalVideos / limit);

      const data = videoUrls.map(user => ({
          email: user.email,
          video_url: [user.video_url],
      }));


      return {
          data,
          page,
          limit,
          totalVideos,
          totalPages,
      };
  } catch (error) {
      throw new Error('Failed to fetch videos');
  }
}



async deleteVideo(id: string): Promise<any> {
  try {
    const data = await this.userModel.findByIdAndDelete(id);    
    if (!data) {
      throw new Error(` URL ${data} not found`);
    }
    return { message: 'Deleted successfully', data: data };
  } catch (error) {
    throw new Error(`Failed to delete user`);
  }
}


async updateFields(id: string, updateDto: UpdateUserDto): Promise<User> {
  try {
    return this.userModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  } catch (error) {
    throw new Error(error.message);
  }
}

}
