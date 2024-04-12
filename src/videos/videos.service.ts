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

  // async getAllVideos(): Promise<any[]> {
  //   try {
  //     const video_urls = await this.userModel.find().select('video_url').exec();
  //     const users = await this.userModel.find().select('email').exec();

  //     const videoObjects = video_urls.map((user, index) => ({
  //         email: users[index].email, 
  //         links: [user.video_url],
  //     }));


  //     return videoObjects;
  //   } catch (error) {
  //     console.error('Error fetching all videos:', error);
  //     throw new Error('Failed to fetch all videos');
  //   }
  // }
  

//   async getAllVideos(page: number = 1, limit: number = 10): Promise<any[]> {
//     try {
//         const skipCount = (page - 1) * limit;
        
//         const video_urls = await this.userModel.find().select('video_url').skip(skipCount).limit(limit).exec();
//         const users = await this.userModel.find().select('email').skip(skipCount).limit(limit).exec();

//         const videoObjects = video_urls.map((user, index) => ({
//             email: users[index].email, 
//             links: [user.video_url],
//         }));

//         return videoObjects;
//     } catch (error) {
//         console.error('Error fetching all videos:', error);
//         throw new Error('Failed to fetch all videos');
//     }
// }


async createVideo(createUserDto: CreateUserDto): Promise<User> {
  try {
    // Check if video file is provided
    if (!createUserDto) {
      throw new Error('No user data added');
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


async findVideosData(
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





async getAllVideos(
  page: number = 1,
  limit: number = 10,
): Promise<{
  data: { email: string; links: string[]; }[];
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
          links: [user.video_url],
      }));

      return {
          data,
          page,
          limit,
          totalVideos,
          totalPages,
      };
  } catch (error) {
      console.error('Error with pagination query', error);
      throw new Error('Failed to fetch videos');
  }
}



async deleteVideo(id: string): Promise<any> {
  try {
    const user = await this.userModel.findByIdAndDelete(id);
    console.log(user);
    
    if (!user) {
      throw new Error(`Video with URL ${user} not found`);
    }
    return { message: 'Video deleted successfully', user: user };
  } catch (error) {
    throw new Error(`Failed to delete user`);
  }

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
