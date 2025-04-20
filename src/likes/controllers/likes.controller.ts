import { Controller, Post, Body } from '@nestjs/common';
import { LikeService } from '../services/likes.service';
import { CreateLikeDto } from '../dtos/likes.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/auth.guards';
@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async likeContent(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.createLike(createLikeDto);
  }
}
