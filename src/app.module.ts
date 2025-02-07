import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './nest/post/post.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PostModule, PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
