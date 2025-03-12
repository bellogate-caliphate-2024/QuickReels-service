import { Controller, Post, Body } from '@nestjs/common';
import { LikeService } from '../likes/likes.service';
import { CreateLikeDto } from '../dtos/likes.dto';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  async likeContent(@Body() createLikeDto: CreateLikeDto) {
    return this.likeService.createLike(createLikeDto);
  }
}
