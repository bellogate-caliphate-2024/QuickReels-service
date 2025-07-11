import { Test, TestingModule } from '@nestjs/testing';
import { UserProgressController } from '../controllers/user-progress.controller';
import { UserProgressService } from '../service/user-progress.service';

const mockService = {
  updateProgress: jest.fn(),
  getProgress: jest.fn(),
};

describe('UserProgressController', () => {
  let controller: UserProgressController;
  let service: typeof mockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserProgressController],
      providers: [
        { provide: UserProgressService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<UserProgressController>(UserProgressController);
    service = module.get(UserProgressService);
    jest.clearAllMocks();
  });

  it('should update progress', async () => {
    mockService.updateProgress.mockResolvedValue({ userId: 'u1', postId: 'p1' });
    const result = await controller.updateProgress({ userId: 'u1', postId: 'p1' });
    expect(result).toEqual({ userId: 'u1', postId: 'p1' });
    expect(mockService.updateProgress).toHaveBeenCalledWith({ userId: 'u1', postId: 'p1' });
  });

  it('should get progress', async () => {
    mockService.getProgress.mockResolvedValue({ userId: 'u2', postId: 'p2' });
    const result = await controller.getProgress('u2');
    expect(result).toEqual({ userId: 'u2', postId: 'p2' });
    expect(mockService.getProgress).toHaveBeenCalledWith('u2');
  });

  it('should return null if no progress', async () => {
    mockService.getProgress.mockResolvedValue(null);
    const result = await controller.getProgress('u3');
    expect(result).toBeNull();
  });
}); 