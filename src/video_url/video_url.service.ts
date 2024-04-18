import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video_Url,video_urlDocument } from './video_url.schema';
import { format } from 'date-fns';
import { UpdateVideo_urlDto } from 'src/dto/updateDto';
import { CreateVideoDto } from 'src/dto/video_url.dto';
@Injectable()
export class VideosService {
  // constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}
  constructor(@InjectModel(Video_Url.name) private readonly video_urlModel: Model<video_urlDocument>) {}


async postVideo(createVideoDTO: CreateVideoDto): Promise<Video_Url> {
  try {
    if (!createVideoDTO) {
      throw new Error('No data added');
    }
    const formattedTime = format(new Date(), 'EEE do MMM yyyy h:mm a');

    createVideoDTO.time = formattedTime;

    // Create a new user object using the createVideoDTO data
    const newPost = new CreateVideoDto(
      createVideoDTO.time,
      createVideoDTO.email,
      createVideoDTO.video_url,
      createVideoDTO.thumbnail,
      createVideoDTO.caption,
    );

    const createdPost = await this.video_urlModel.create(newPost);
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
  data: Video_Url[];
  page: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
}> {
  try {
    const skip = (page - 1) * limit;
    const content = await this.video_urlModel.find().skip(skip).limit(limit).exec();
    const totalUsers = await this.video_urlModel.countDocuments().exec();
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
      const videoUrls = await this.video_urlModel.find().select('email video_url').skip(skip).limit(limit).exec();
      const totalVideos = await this.video_urlModel.countDocuments().exec();
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
    const data = await this.video_urlModel.findByIdAndDelete(id);    
    if (!data) {
      throw new Error(` URL ${data} not found`);
    }
    return { message: 'Deleted successfully', data: data };
  } catch (error) {
    throw new Error(`Failed to delete user`);
  }
}


async updateFields(id: string, updateDto: UpdateVideo_urlDto): Promise<Video_Url> {
  try {
    return this.video_urlModel
      .findByIdAndUpdate(id, updateDto, { new: true })
      .exec();
  } catch (error) {
    throw new Error(error.message);
  }
}

}
