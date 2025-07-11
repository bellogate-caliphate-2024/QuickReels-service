import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { UserProgressService } from '../service/user-progress.service';
import { UpdateUserProgressDto, UserProgressResponseDto } from '../dtos/user-progress.dto';

@ApiTags('User Progress')
@Controller('user-progress')
export class UserProgressController {
  constructor(private readonly userProgressService: UserProgressService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Update user progress',
    description: 'Update the last watched post for a user'
  })
  @ApiBody({ 
    type: UpdateUserProgressDto,
    examples: {
      example1: {
        summary: 'Update progress with caption',
        value: {
          userId: '507f1f77bcf86cd799439011',
          postId: '507f1f77bcf86cd799439012',
          postCaption: 'Amazing sunset view!'
        }
      },
      example2: {
        summary: 'Update progress without caption',
        value: {
          userId: '507f1f77bcf86cd799439011',
          postId: '507f1f77bcf86cd799439012'
        }
      }
    }
  })
  
  
  @ApiResponse({ 
    status: 201, 
    description: 'Progress updated successfully',
    type: UserProgressResponseDto
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateProgress(@Body() dto: UpdateUserProgressDto): Promise<UserProgressResponseDto> {
    const progress = await this.userProgressService.updateProgress(dto);
    return { userId: progress.userId, postId: progress.postId, postCaption: progress.postCaption };
  }

  @Get(':userId')
  @ApiOperation({ 
    summary: 'Get user progress',
    description: 'Retrieve the last watched post for a user'
  })
  @ApiParam({ 
    name: 'userId', 
    description: 'User ID to get progress for',
    example: '507f1f77bcf86cd799439011'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'User progress retrieved successfully',
    type: UserProgressResponseDto
  })
  @ApiResponse({ status: 404, description: 'No progress found' })
  async getProgress(@Param('userId') userId: string): Promise<UserProgressResponseDto | null> {
    const progress = await this.userProgressService.getProgress(userId);
    if (!progress) return null;
    return { userId: progress.userId, postId: progress.postId, postCaption: progress.postCaption };
  }
} 