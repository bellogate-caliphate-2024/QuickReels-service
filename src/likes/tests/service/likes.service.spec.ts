import { Test, TestingModule } from '@nestjs/testing';
import { LikeService } from '../../services/likes.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from '../../models/likes.schema';
import { DatabaseHelper } from '../../../helpers/helper';
import { CreateLikeDto } from 'src/likes/dtos/likes.dto';
import { LikeRepository } from '../../repository/likes.repository';

describe('LikeService', () => {
  let service: LikeService;
  let likeModel: Model<Like>;

  const mockHelper = {
    someFunction: jest.fn(),
    time: jest.fn(),
  };

  const mockAction = {
    formatTime: jest.fn().mockReturnValue('2025-03-05T12:00:00Z'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeService,
        {
          provide: 'ACTION',
          useValue: mockAction,
        },
        {
          provide: getModelToken('Like'),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken('Post'),
          useValue: {},
        },
        {
          provide: LikeRepository,
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            findLike: jest.fn(), 

          },
        },
        {
          provide: DatabaseHelper,
          useValue: mockHelper,
        }
      ],
    }).compile();

    service = module.get<LikeService>(LikeService);
    likeModel = module.get<Model<Like>>(getModelToken('Like'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const mockCreateLikeDto: CreateLikeDto = {
    userId: 'user123',
    contentId: 'content456',
  };

  it('should return a message if the user has already liked the content', async () => {
    jest.spyOn(likeModel, 'findOne').mockResolvedValue({ mockCreateLikeDto });

    const result = await service.createLike(mockCreateLikeDto);

    expect(result).toEqual({ message: 'User already liked this content' });
  });

  it('should return false if the user has not liked the content', async () => {
    jest.spyOn(likeModel, 'findOne').mockResolvedValue(null);

    const mockSavedLike = {
      userId: 'user123',
      contentId: 'content456',
      time: '2025-03-05T10:00:00Z',
    };

    jest.spyOn(likeModel, 'create').mockResolvedValue(mockSavedLike as any);

    const result = await service.createLike(mockCreateLikeDto);

    expect(result.message).toBe('Like added successfully');
    expect(likeModel.findOne).toHaveBeenCalledWith({
      userId: 'user123',
      contentId: 'content456',
    });
    expect(likeModel.create).toHaveBeenCalledWith({
      userId: 'user123',
      contentId: 'content456',
      time: '2025-03-05T10:00:00Z',
    });
    expect(mockHelper.time).toHaveBeenCalledWith('2025-03-05T10:00:00Z');
  });
});
