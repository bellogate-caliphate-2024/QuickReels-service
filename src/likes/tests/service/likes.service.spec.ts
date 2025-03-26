import { Test, TestingModule } from '@nestjs/testing';
import { LikeService } from '../../services/likes.service';
import { getModelToken } from '@nestjs/mongoose';
import { DatabaseHelper } from '../../../helpers/helper';
import { CreateLikeDto } from 'src/likes/dtos/likes.dto';
import { LikeRepository } from '../../repository/like.repository';

describe('LikeService', () => {
  let service: LikeService;
  let likeRepository: LikeRepository;

  const mockAction = {
    formatTime: jest.fn().mockResolvedValue('2025-03-05T12:00:00Z'),
  };

  const mockLikeRepository = {
    findLike: jest.fn(),
    createLike: jest.fn().mockImplementation((dto) => ({
      ...dto,
      _id: 'some-id',
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeService,
        {
          provide: DatabaseHelper,
          useValue: mockAction,
        },
        {
          provide: LikeRepository,
          useValue: mockLikeRepository,
        },
        {
          provide: getModelToken('Like'),
          useValue: {},
        },
        {
          provide: getModelToken('Post'),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<LikeService>(LikeService);
    likeRepository = module.get<LikeRepository>(LikeRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const mockCreateLikeDto: CreateLikeDto = {
    userId: 'user123',
    contentId: 'content456',
  };

  it('should return a message if user already liked the content', async () => {
    mockLikeRepository.findLike.mockResolvedValue({
      userId: 'user123',
      contentId: 'content456',
    });

    const result = await service.createLike(mockCreateLikeDto);
    expect(result).toEqual({ message: 'User already liked this content' });
  });

  it('should add a like if not already liked', async () => {
    mockLikeRepository.findLike
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    mockLikeRepository.createLike.mockResolvedValueOnce({
      _id: 'new-id',
      ...mockCreateLikeDto,
      time: new Date().toISOString(),
    });

    const result = await service.createLike(mockCreateLikeDto);

    expect(result).toEqual({
      message: 'Like added successfully',
      newLike: expect.objectContaining({
        _id: 'new-id',
        ...mockCreateLikeDto,
        time: expect.any(String),
      }),
    });

    expect(mockLikeRepository.findLike).toHaveBeenCalledTimes(2);
    expect(mockLikeRepository.createLike).toHaveBeenCalledTimes(1);
  });
});
