import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PostsRepository } from '../../repository/posts.repository';
import { Model } from 'mongoose';

describe('PostRepository - getAds', () => {
  let repository: PostsRepository;
  let postModel: Model<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsRepository,
        {
          provide: getModelToken('Post'),
          useValue: {
            find: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockReturnThis(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<PostsRepository>(PostsRepository);
    postModel = module.get<Model<any>>(getModelToken('Post'));
  });

  it('should return mapped ads with videoUrl and isAd=true', async () => {
    const mockAds = [
      { video_url: ['https://example.com/ad1.mp4'] },
      { video_url: ['https://example.com/ad2.mp4'] },
    ];

    (
      postModel.find({}).select('video_url').lean().exec as jest.Mock
    ).mockResolvedValue(mockAds);

    const result = await repository.getAds();

    expect(result).toEqual([
      { videoUrl: 'https://example.com/ad1.mp4', isAd: true },
      { videoUrl: 'https://example.com/ad2.mp4', isAd: true },
    ]);

    expect(postModel.find).toHaveBeenCalledWith({ isAd: true });
  });
});
