import { Module} from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/Schemas/posts.schema';
import { Helper } from 'src/helpers/helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), // Register PostModel
  ],
  controllers: [PostsController],
  providers: [PostsService,Helper]
})
export class PostsModule {}
