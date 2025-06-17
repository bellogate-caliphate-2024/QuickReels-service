import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FollowersRepository } from '../repository/followers.repository';
import { CreateFollowerDto } from '../dtos/followers.dto';

@Injectable()
export class FollowersService {
  constructor(private readonly followersRepository: FollowersRepository) {}

  async followUser(createFollowerDto: CreateFollowerDto) {
    const { followerEmail, followingEmail } = createFollowerDto;

    if (followerEmail === followingEmail) {
      throw new BadRequestException('Users cannot follow themselves');
    }

    const existingFollow = await this.followersRepository.findFollow(
      followerEmail,
      followingEmail,
    );
    if (existingFollow) {
      throw new BadRequestException('Already following this user');
    }

    return this.followersRepository.createFollow(createFollowerDto);
  }

  async unfollowUser(followerEmail: string, followingEmail: string) {
    const result = await this.followersRepository.deleteFollow(
      followerEmail,
      followingEmail,
    );
    if (!result) {
      throw new NotFoundException('Follow relationship not found');
    }
    return { message: 'Successfully unfollowed user' };
  }

  async getFollowersCount(userEmail: string) {
    return {
      followersCount:
        await this.followersRepository.getFollowersCount(userEmail),
    };
  }

  async getFollowingCount(userEmail: string) {
    return {
      followingCount:
        await this.followersRepository.getFollowingCount(userEmail),
    };
  }

  async getAllFollowers(userEmail: string) {
    return this.followersRepository.getAllFollowers(userEmail);
  }

  async getAllFollowing(userEmail: string) {
    return this.followersRepository.getAllFollowing(userEmail);
  }

  async getAllFollowRelationships() {
    return this.followersRepository.getAllFollowRelationships();
  }
}
