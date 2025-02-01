// src/post/post.module.ts
import { Module, Post } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostModule {}