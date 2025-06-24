import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { User, UserSchema } from './schema/user.schema';
import { CloudinaryModule } from '../infrastructure/cloudinary/cloudinary.module';
import { UserRepository } from './reposiotry/user.repository';
import { JwtService } from '@nestjs/jwt';
import { PostsService } from '../posts/services/posts.service';
import { PostsRepository } from '../posts/repository/posts.repository';
import { AwsS3Service } from '../DataBase/Aws';
import { DatabaseHelper } from '../helpers/helper';
import { Post, PostSchema } from '../posts/models/posts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }, { name: Post.name, schema: PostSchema }]),
    CloudinaryModule,
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtService, PostsService, PostsRepository, AwsS3Service, DatabaseHelper, Post],
  exports: [UserService],
})
export class UserModule {}

