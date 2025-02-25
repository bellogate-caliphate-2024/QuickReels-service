import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/Schemas/posts.schema';
import { Helper } from '../helpers/helper.module';
import { AwsS3Service } from 'src/DataBase/Aws';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), // Register PostModel
  ],
  controllers: [PostsController],
  providers: [PostsService, Helper, AwsS3Service],
})
export class PostsModule {}
