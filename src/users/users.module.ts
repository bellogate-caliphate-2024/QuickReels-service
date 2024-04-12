import { VideosModule } from './../videos/videos.module';
import { UsersController } from './users.controller';
import { Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnection } from 'src/db';
import { User, userSchema} from './users.schema';
import { UsersService } from './users.service';
import { VideosService } from 'src/videos/videos.service';
import { VideosController } from 'src/videos/videos.controller';


@Module({
  imports: [
    MongooseModule.forFeature([{name: "User", schema: userSchema}]),
    MongooseModule.forRootAsync({
      useClass: DatabaseConnection,
    }),
  ],
    
    controllers: [UsersController,VideosController],
    providers: [UsersService,DatabaseConnection,VideosService,User],
    exports:[User]
    
})
export class UsersModule {}

