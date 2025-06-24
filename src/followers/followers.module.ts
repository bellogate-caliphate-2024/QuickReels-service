import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Follower, FollowerSchema } from './models/followers.schema';
import { FollowersController } from './controllers/followers.controller';
import { FollowersService } from './services/followers.service';
import { FollowersRepository } from './repository/followers.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follower.name, schema: FollowerSchema },
    ]),
  ],
  controllers: [FollowersController],
  providers: [FollowersService, FollowersRepository],
  exports: [FollowersService],
})
export class FollowersModule {}
