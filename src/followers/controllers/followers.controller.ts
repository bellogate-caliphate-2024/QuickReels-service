import { Controller, Post, Delete, Body, Param, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { FollowersService } from '../services/followers.service';
import { CreateFollowerDto } from '../dtos/followers.dto';
import { JwtAuthGuard } from '../../auth/guards/auth.guards';

@ApiTags('Followers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('followers')
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Post()
  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({ status: 201, description: 'Successfully followed user' })
  async followUser(@Body() createFollowerDto: CreateFollowerDto) {
    return this.followersService.followUser(createFollowerDto);
  }

  @Delete(':followerEmail/:followingEmail')
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiParam({ name: 'followerEmail', description: 'Email of the user who wants to unfollow' })
  @ApiParam({ name: 'followingEmail', description: 'Email of the user to be unfollowed' })
  @ApiResponse({ status: 200, description: 'Successfully unfollowed user' })
  async unfollowUser(
    @Param('followerEmail') followerEmail: string,
    @Param('followingEmail') followingEmail: string,
  ) {
    return this.followersService.unfollowUser(followerEmail, followingEmail);
  }

  @Get(':userEmail/followers/count')
  @ApiOperation({ summary: 'Get number of followers for a user' })
  @ApiParam({ name: 'userEmail', description: 'Email of the user' })
  @ApiResponse({ status: 200, description: 'Returns the number of followers' })
  async getFollowersCount(@Param('userEmail') userEmail: string) {
    return this.followersService.getFollowersCount(userEmail);
  }

  @Get(':userEmail/following/count')
  @ApiOperation({ summary: 'Get number of users being followed' })
  @ApiParam({ name: 'userEmail', description: 'Email of the user' })
  @ApiResponse({ status: 200, description: 'Returns the number of users being followed' })
  async getFollowingCount(@Param('userEmail') userEmail: string) {
    return this.followersService.getFollowingCount(userEmail);
  }

  @Get(':userEmail/followers')
  @ApiOperation({ summary: 'Get all followers for a user' })
  @ApiParam({ name: 'userEmail', description: 'Email of the user' })
  @ApiResponse({ status: 200, description: 'Returns list of followers' })
  async getAllFollowers(@Param('userEmail') userEmail: string) {
    return this.followersService.getAllFollowers(userEmail);
  }

  @Get(':userEmail/following')
  @ApiOperation({ summary: 'Get all users being followed' })
  @ApiParam({ name: 'userEmail', description: 'Email of the user' })
  @ApiResponse({ status: 200, description: 'Returns list of users being followed' })
  async getAllFollowing(@Param('userEmail') userEmail: string) {
    return this.followersService.getAllFollowing(userEmail);
  }

  @Get('all/relationships')
  @ApiOperation({ summary: 'Get all follow relationships in the system' })
  @ApiResponse({ status: 200, description: 'Returns all follow relationships' })
  async getAllFollowRelationships() {
    return this.followersService.getAllFollowRelationships();
  }
} 