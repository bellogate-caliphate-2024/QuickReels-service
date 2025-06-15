import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { LikeService } from '../services/likes.service';
import { CreateLikeDto } from '../dtos/likes.dto';
import { JwtAuthGuard } from '../../auth/guards/auth.guards';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Likes')
@ApiBearerAuth()
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Like content' })
  @ApiResponse({ status: 201, description: 'Like created successfully' })
  async likeContent(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.createLike(createLikeDto);
  }
}
