import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Like, LikeSchema } from '../likes/models/likes.schema';
import { Comment, CommentSchema } from './models/comments.schema';
import { CommentService } from './services/comments.service';
import { CommentRepository } from './repository/comments.repository';
import { CommentController } from './controller/comments.controller';
import { PostsModule } from '../posts/posts.module';
import { Post, PostSchema } from '../posts/models/posts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Post.name, schema: PostSchema },
    ]),
    PostsModule,
  ],
  controllers: [CommentController],
  providers: [CommentRepository, CommentService],
})
export class CommentsModule {}
