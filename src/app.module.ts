import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://Gavin:x$rayG1G@cluster0.su3jrhq.mongodb.net/POSTS'),
    PostsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
