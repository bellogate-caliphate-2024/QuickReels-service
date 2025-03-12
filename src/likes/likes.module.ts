import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from '../Schemas/likes.schema';
import { LikeService } from '../likes/likes.service';
import { LikeController } from '../likes/likes.controller';
import { Post, PostSchema } from '../Schemas/posts.schema';
import { Helper } from 'src/helpers/helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Like.name, schema: LikeSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  controllers: [LikeController],
  providers: [LikeService, Helper],
  exports: [LikeService],
})
export class LikeModule {}
