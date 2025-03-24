import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from './models/likes.schema';
import { LikeService } from '../likes/services/likes.service';
import { LikeController } from './controllers/likes.controller';
import { Post, PostSchema } from '../posts/models/posts.schema';
import { DatabaseHelper } from 'src/helpers/helper';
import { LikeRepository } from './repository/likes.repository';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [LikeController],
  providers: [LikeService, DatabaseHelper,LikeRepository],
  exports: [LikeService],
})
export class LikeModule {}
