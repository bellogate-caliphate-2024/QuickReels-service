import { Test, TestingModule } from '@nestjs/testing';
import { UserProgressService } from '../service/user-progress.service';
import { UserProgressRepository } from '../repository/user-progress.repository';

const mockRepo = {
  upsertProgress: jest.fn(),
  findByUserId: jest.fn(),
};

describe('UserProgressService', () => {
  let service: UserProgressService;
  let repo: typeof mockRepo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserProgressService,
        { provide: UserProgressRepository, useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UserProgressService>(UserProgressService);
    repo = module.get(UserProgressRepository);
    jest.clearAllMocks();
  });

  it('should update progress', async () => {
    mockRepo.upsertProgress.mockResolvedValue({ userId: 'u1', postId: 'p1' });
    const result = await service.updateProgress({ userId: 'u1', postId: 'p1' });
    expect(result).toEqual({ userId: 'u1', postId: 'p1' });
    expect(mockRepo.upsertProgress).toHaveBeenCalledWith('u1', 'p1', undefined);
  });

  it('should get progress', async () => {
    mockRepo.findByUserId.mockResolvedValue({ userId: 'u2', postId: 'p2' });
    const result = await service.getProgress('u2');
    expect(result).toEqual({ userId: 'u2', postId: 'p2' });
    expect(mockRepo.findByUserId).toHaveBeenCalledWith('u2');
  });

  it('should return null if no progress', async () => {
    mockRepo.findByUserId.mockResolvedValue(null);
    const result = await service.getProgress('u3');
    expect(result).toBeNull();
  });
}); 