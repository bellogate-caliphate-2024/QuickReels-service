import { Module } from '@nestjs/common';
import { PostsController } from './controllers/posts.controller';
import { PostsService } from './services/posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/posts/models/posts.schema';
import { DatabaseHelper } from '../helpers/helper.module';
import { AwsS3Service } from '../DataBase/aws.module';
import { Like, LikeSchema } from '../likes/models/likes.schema';
import { PostsRepository } from './repository/posts.repository';
import { FirebaseModule } from '../infrastructure/firebase';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
    FirebaseModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, DatabaseHelper, AwsS3Service, PostsRepository],
})
export class PostsModule {}
