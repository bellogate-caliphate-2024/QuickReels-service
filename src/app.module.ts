import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PostModule } from './posts/posts.module';
import {config} from 'dotenv'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true, // Make the configuration global
    }),
    MongooseModule.forRoot(process.env.MONGODB || ''),
    PostModule
  ],
  controllers: [AppController, PostsController],
  providers: [AppService],
})
export class AppModule {}
