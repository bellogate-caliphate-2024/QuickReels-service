import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schema/user.schema';
import { UpdateProfileNameDto } from '../dtos/user-profile.dto';
import { CloudinaryService } from '../../infrastructure/cloudinary/cloudinary.service';
import { UserRepository } from '../reposiotry/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly userRepository: UserRepository,
  ) {}

  async findByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async createUser(data: Partial<User>) {
    return this.userRepository.createUser(data);
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfileName(userId: string, updateProfileNameDto: UpdateProfileNameDto): Promise<User> {
    const user = await this.findById(userId);
    user.name = updateProfileNameDto.name;
    return user.save();
  }

  async updateProfilePicture(userId: string, file: Express.Multer.File): Promise<User> {
    const user = await this.findById(userId);

    if (!file) {
      throw new BadRequestException('Profile picture file is required');
    }

    if (user.avatar) {
      const publicId = this.getCloudinaryPublicId(user.avatar);
      if (publicId) {
        await this.cloudinaryService.deleteFile(publicId);
      }
    }

    const uploadResult = await this.cloudinaryService.uploadFile(file);
    user.avatar = uploadResult.secure_url;
    
    return user.save();
  }

  async deleteAccount(userId: string): Promise<void> {
    const user = await this.findById(userId);

    if (user.avatar) {
      const publicId = this.getCloudinaryPublicId(user.avatar);
      if (publicId) {
        await this.cloudinaryService.deleteFile(publicId);
      }
    }

    await user.deleteOne();
  }

  private getCloudinaryPublicId(url: string): string | null {
    try {
      const urlParts = url.split('/');
      const filename = urlParts[urlParts.length - 1];
      return filename.split('.')[0];
    } catch (error) {
      return null;
    }

  
}
