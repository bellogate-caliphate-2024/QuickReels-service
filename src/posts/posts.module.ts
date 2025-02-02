// src/post/post.module.ts
import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema ,Post } from 'src/data/Abstarcts/Schemas/posts.schema';
import { Helper } from 'src/helpers/helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    
  ],
  controllers: [PostsController],
  providers: [PostsService,Helper],
  exports: [PostsService]

})
export class PostModule {}