import { Module} from '@nestjs/common';
import { User, userSchema } from 'src/users/users.schema';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnection } from 'src/db';
@Module({
    imports: [
      UsersModule,
      MongooseModule.forFeature([{name: "User", schema: userSchema}]),
      MongooseModule.forRootAsync({
        useClass: DatabaseConnection,
      }),
    ],
      controllers: [VideosController],
      providers: [VideosService,User],
      
  })



export class VideosModule {}










