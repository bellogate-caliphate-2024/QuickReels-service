import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/Schemas/posts.schema';
import { DatabaseHelper } from '../helpers/helper.module';
import { AwsS3Service } from 'src/DataBase/Aws';
import { Like, LikeSchema } from '../Schemas/likes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, DatabaseHelper, AwsS3Service],
})
export class PostsModule {}
