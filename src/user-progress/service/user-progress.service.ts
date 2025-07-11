import { Injectable } from '@nestjs/common';
import { UserProgressRepository } from '../repository/user-progress.repository';
import { UpdateUserProgressDto } from '../dtos/user-progress.dto';

@Injectable()
export class UserProgressService {
  constructor(private readonly userProgressRepository: UserProgressRepository) {}

  async updateProgress(dto: UpdateUserProgressDto) {
    return this.userProgressRepository.upsertProgress(dto.userId, dto.postId, dto.postCaption);
  }

  async getProgress(userId: string) {
    return this.userProgressRepository.findByUserId(userId);
  }
} 