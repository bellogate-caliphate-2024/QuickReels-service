import { Test, TestingModule } from '@nestjs/testing';
import { LikeController } from '../likes/likes.controller';
import { LikeService } from '../likes/likes.service';
import { CreateLikeDto } from '../dtos/likes.dto';

describe('LikeController', () => {
  let controller: LikeController;
  let service: LikeService;

  const mockLikeService = {
    createLike: jest.fn((dto) => {
      return {
        message: 'Like added successfully',
        newLike: { ...dto, id: '123' },
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikeController],
      providers: [{ provide: LikeService, useValue: mockLikeService }],
    }).compile();

    controller = module.get<LikeController>(LikeController);
    service = module.get<LikeService>(LikeService);
  });

  it('should call LikeService and return success message when liking content', async () => {
    const createLikeDto: CreateLikeDto = {
      userId: 'user123',
      contentId: 'content123',
      time: new Date(),
    };

    const result = await controller.likeContent(createLikeDto);

    expect(service.createLike).toHaveBeenCalledWith(createLikeDto);
    expect(result).toEqual({
      message: 'Like added successfully',
      newLike: expect.objectContaining(createLikeDto),
    });
  });
});
