import { UsersController } from './users.controller';
import { Module} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseConnection } from 'src/db';
import { User, userSchema} from './users.schema';
import { UsersService } from './users.service';


@Module({
  imports: [
    MongooseModule.forFeature([{name: "User", schema: userSchema}]),
    MongooseModule.forRootAsync({
      useClass: DatabaseConnection,
    }),
  ],
    
    controllers: [UsersController],
    providers: [UsersService,DatabaseConnection,User],
    exports: [UsersService]
})
export class UsersModule {}

