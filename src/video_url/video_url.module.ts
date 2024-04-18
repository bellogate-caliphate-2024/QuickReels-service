import { Module} from '@nestjs/common';
import { VideosController } from './video_url.controller';
import { VideosService } from './video_url.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnection } from 'src/db';
import { Video_Url,video_urlSchema } from './video_url.schema';
@Module({
    imports: [
      MongooseModule.forFeature([{name: "Video_Url", schema: video_urlSchema}]),
      MongooseModule.forRootAsync({
        useClass: DatabaseConnection,
      }),
    ],
      controllers: [VideosController],
      providers: [VideosService,Video_Url],
      
  })



export class VideosModule {}










