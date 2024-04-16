import { VideosModule } from '../data/data.module';
import { UsersController } from './users.controller';
import { Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnection } from 'src/db';
import { User, userSchema} from './users.schema';
import { UsersService } from './users.service';
import { VideosService } from 'src/data/data.service';
import { VideosController } from 'src/data/data.controller';


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

