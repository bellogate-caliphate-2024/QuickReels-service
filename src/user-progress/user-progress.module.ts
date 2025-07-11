import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserProgress, UserProgressSchema } from './models/user-progress.schema';
import { UserProgressRepository } from './repository/user-progress.repository';
import { UserProgressService } from './service/user-progress.service';
import { UserProgressController } from './controllers/user-progress.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: UserProgress.name, schema: UserProgressSchema }])],
  providers: [UserProgressRepository, UserProgressService],
  controllers: [UserProgressController],
  exports: [UserProgressService],
})
export class UserProgressModule {} 