import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { FollowersRepository } from '../repository/followers.repository';
import { CreateFollowerDto } from '../dtos/followers.dto';

@Injectable()
export class FollowersService {
  private readonly logger = new Logger(FollowersService.name);

  constructor(private readonly followersRepository: FollowersRepository) {}

  async followUser(createFollowerDto: CreateFollowerDto) {
    try {
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
    } catch (error) {
      this.logger.error(
        `Failed to follow user: ${error.message}`,
        error.stack,
      );
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to follow user');
    }
  }

  async unfollowUser(followerEmail: string, followingEmail: string) {
    try {
      const result = await this.followersRepository.deleteFollow(
        followerEmail,
        followingEmail,
      );
      if (!result) {
        throw new NotFoundException('Follow relationship not found');
      }
      return { message: 'Successfully unfollowed user' };
    } catch (error) {
      this.logger.error(
        `Failed to unfollow user: ${error.message}`,
        error.stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to unfollow user');
    }
  }

  async getFollowersCount(userEmail: string) {
    try {
      return {
        followersCount:
          await this.followersRepository.getFollowersCount(userEmail),
      };
    } catch (error) {
      this.logger.error(
        `Failed to get followers count for ${userEmail}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to get followers count');
    }
  }

  async getFollowingCount(userEmail: string) {
    try {
      return {
        followingCount:
          await this.followersRepository.getFollowingCount(userEmail),
      };
    } catch (error) {
      this.logger.error(
        `Failed to get following count for ${userEmail}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to get following count');
    }
  }

  async getAllFollowers(userEmail: string) {
    try {
      return this.followersRepository.getAllFollowers(userEmail);
    } catch (error) {
      this.logger.error(
        `Failed to get all followers for ${userEmail}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to get all followers');
    }
  }

  async getAllFollowing(userEmail: string) {
    try {
      return this.followersRepository.getAllFollowing(userEmail);
    } catch (error) {
      this.logger.error(
        `Failed to get all following for ${userEmail}: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to get all following');
    }
  }

  async getAllFollowRelationships() {
    try {
      return this.followersRepository.getAllFollowRelationships();
    } catch (error) {
      this.logger.error(
        `Failed to get all follow relationships: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException(
        'Failed to get all follow relationships',
      );
    }
  }
}
