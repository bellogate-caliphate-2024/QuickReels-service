import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UsersService } from './service/user.service';
import { UserRepository } from './reposiotry/user.repository';
import{UsersController} from '../user/controller/user';
import { JwtService } from '@nestjs/jwt';
import {PostsService} from '../posts/services/posts.service';
import {PostsRepository} from '../posts/repository/posts.repository';
import {AwsS3Service} from '../DataBase/Aws';
import {DatabaseHelper} from '../helpers/helper';
import {Post, PostSchema} from '../posts/models/posts.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{ name: Post.name, schema: PostSchema }
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, JwtService,PostsService,PostsRepository,AwsS3Service,DatabaseHelper,Post],
  exports: [UsersService],
})
export class UsersModule {}
