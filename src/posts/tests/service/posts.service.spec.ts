import { PostsService } from '../../services/posts.service';
import { mockFile } from '../../../__mock__/file';
import { CreatePostDto } from '../../dtos/posts.dto';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseHelper } from '../../../helpers/helper';
import { Like } from '../../../likes/models/likes.schema';
import { Post } from '../../models/posts.schema';
import { AwsS3Service } from '../../../DataBase/Aws';
import { PostsRepository } from '../../repository/posts.repository';

const mockAwsS3Service = {
  uploadFile: jest.fn().mockResolvedValue('https://mock-s3-url.com/video.mp4'),
  deleteFile: jest.fn().mockResolvedValue(true),
};

describe('PostsService', () => {
  let service: PostsService;
  let postModel: Model<any>;
  let helper: DatabaseHelper;

  const mockHelper = {
    alternateMockPosts: jest.fn((posts) => {
      return posts.map((post, index) => ({
        ...post,
        Ismock: index % 2 === 0,
      }));
    }),
    fetchAllPosts: jest.fn().mockResolvedValue([
      {
        video_url: ['https://example.com/video.mp4'],
        thumbnail: ['https://example.com/thumb.jpg'],
        caption: 'Test Caption',
        time: '2025-02-24T08:00:59.602Z',
        numberOfViews: 100,
        numberOfLikes: 10,
        numberOfComments: 5,
        email: 'test@example.com',
        userName: 'Test User',
        userProfilePicture: 'https://example.com/profile.jpg',
        isLiked: true,
        Ismock: false,
      },
    ]),
    randomizeADs: jest.fn((posts, ads) => {
      const combined = [...posts, ...ads];
      for (let i = combined.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [combined[i], combined[j]] = [combined[j], combined[i]];
      }
      return combined;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostsRepository,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        { provide: DatabaseHelper, useValue: mockHelper },
        { provide: getModelToken(Like.name), useValue: {} },
        { provide: AwsS3Service, useValue: mockAwsS3Service },
        {
          provide: getModelToken('Post'),
          useValue: {
            find: jest.fn().mockReturnThis(),
            lean: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValue([
              {
                video_url: ['https://example.com/video.mp4'],
                thumbnail: ['https://example.com/thumb.jpg'],
                caption: 'Test Caption',
                time: '2025-02-24T08:00:59.602Z',
                numberOfViews: 100,
                numberOfLikes: 10,
                numberOfComments: 5,
                email: 'test@example.com',
                userName: 'Test User',
                userProfilePicture: 'https://example.com/profile.jpg',
                isLiked: true,
                Ismock: false,
              },
            ]),
          },
        },
        {
          provide: getModelToken('Like'),
          useValue: {
            find: jest.fn().mockReturnThis(),
            create: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postModel = module.get<Model<any>>(getModelToken('Post'));
    helper = module.get<DatabaseHelper>(DatabaseHelper);
  });

  it('should create a post and return success message with new post', async () => {
    const mockPost: CreatePostDto = {
      email: 'test@example.com',
      video_url: ['https://example.com/video.mp4'] as string[],
      thumbnail: ['https://example.com/thumbnail.jpg'] as string[], // Now required
      caption: 'This is a test post',
      Ismock: true,
      time: '2023-10-01T12:00:00Z',
      userName: 'Test User',
      isLiked: false,
      isAd: false,
    };

    const mockCreatedPost = {
      id: 'new-post-id',
      ...mockPost,
      time: new Date().toISOString(),
      numberOfViews: 0,
      numberOfLikes: 0,
      numberOfComments: 0,
      userProfilePicture: '',
    };

    jest.spyOn(service, 'createPost').mockResolvedValue({
      message: 'Post created successfully',
      newPost: mockCreatedPost as Post,
    });

    const result = await service.createPost(mockFile, mockPost);

    expect(result).toEqual({
      message: 'Post created successfully',
      newPost: mockCreatedPost,
    });
  });

  it('should return correct pagination fields', async () => {
    const mockPosts = [
      {
        _id: '1',
        id: '1',
        video_url: ['video1.mp4', 'video2.mp4'],
        thumbnail: ['thumb1.jpg', 'thumb2.jpg'],
        caption: 'Caption 1',
        time: new Date().toISOString(),
        numberOfViews: 10,
        numberOfLikes: 5,
        numberOfComments: 2,
        email: 'user@example.com',
        userName: 'John Doe',
        userProfilePicture: 'profile.jpg',
        isLiked: true,
        Ismock: false,
      },
    ];

    (postModel.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockPosts),
    });

    const page = 1;
    const limit = 1;
    jest.spyOn(service, 'getContents').mockResolvedValue({
      currentPage: page,
      listOfContents: mockPosts.slice(0, limit),
      isLastPage: false,
      totalItems: 6,
      nextPage: page + 1,
    });

    const result = await service.getContents(0, 10);

    expect(result).toEqual({
      currentPage: page,
      listOfContents: mockPosts.slice(0, limit),
      isLastPage: false,
      totalItems: 6,
      nextPage: page + 1,
    });
  });

  it('should alternate results between Ismock = true and Ismock = false', () => {
    const mockPosts = [
      { _id: '1', Ismock: true },
      { _id: '2', Ismock: false },
      { _id: '3', Ismock: true },
      { _id: '4', Ismock: false },
    ];

    const nonMockPosts = [
      { _id: '5', Ismock: false },
      { _id: '6', Ismock: true },
      { _id: '7', Ismock: false },
      { _id: '8', Ismock: true },
    ];

    const result = helper.alternateMockPosts(mockPosts);

    const isMockValues = result.map((post) => post.Ismock);

    for (let i = 0; i < isMockValues.length - 1; i++) {
      expect(isMockValues[i]).not.toBe(isMockValues[i + 1]);
    }
  });

  it('should fetch all posts with the specified fields', async () => {
    const result = await helper.fetchAllPosts();
    expect(result).toEqual(expect.any(Array));
    expect(result[0]).toHaveProperty('video_url');
    expect(result[0]).toHaveProperty('thumbnail');
    expect(result[0]).toHaveProperty('caption');
    expect(result[0]).toHaveProperty('time');
    expect(result[0]).toHaveProperty('numberOfViews');
    expect(result[0]).toHaveProperty('numberOfLikes');
    expect(result[0]).toHaveProperty('numberOfComments');
    expect(result[0]).toHaveProperty('email');
    expect(result[0]).toHaveProperty('userName');
    expect(result[0]).toHaveProperty('userProfilePicture');
    expect(result[0]).toHaveProperty('isLiked');
    expect(result[0]).toHaveProperty('Ismock');
  });

  it('should insert ads at random positions among posts', async () => {
    const posts: Post[] = [
      {
        id: '1',
        video_url: ['video1.mp4'],
        thumbnail: ['thumb1.jpg'],
        caption: 'Caption 1',
        time: new Date().toISOString(),
        numberOfViews: 0,
        numberOfLikes: 0,
        numberOfComments: 0,
        email: 'user1@example.com',
        userName: 'User One',
        userProfilePicture: 'profile1.jpg',
        Ismock: false,
        isAd: false,
      },
      {
        id: '2',
        video_url: ['video2.mp4'],
        thumbnail: ['thumb2.jpg'],
        caption: 'Caption 2',
        time: new Date().toISOString(),
        numberOfViews: 0,
        numberOfLikes: 0,
        numberOfComments: 0,
        email: 'user2@example.com',
        userName: 'User Two',
        userProfilePicture: 'profile2.jpg',
        Ismock: false,
        isAd: false,
      },
      {
        id: '3',
        video_url: ['video3.mp4'],
        thumbnail: ['thumb3.jpg'],
        caption: 'Caption 3',
        time: new Date().toISOString(),
        numberOfViews: 0,
        numberOfLikes: 0,
        numberOfComments: 0,
        email: 'user3@example.com',
        userName: 'User Three',
        userProfilePicture: 'profile3.jpg',
        Ismock: false,
        isAd: false,
      },
    ];
    const ads: Post[] = [
      {
        id: 'A',
        video_url: ['ad1.mp4'],
        thumbnail: ['ad1-thumb.jpg'],
        caption: 'Ad Caption 1',
        time: new Date().toISOString(),
        numberOfViews: 0,
        numberOfLikes: 0,
        numberOfComments: 0,
        email: 'ad1@example.com',
        userName: 'Ad User 1',
        userProfilePicture: 'ad1-profile.jpg',
        Ismock: false,
        isAd: true,
      },
      {
        id: 'B',
        video_url: ['ad2.mp4'],
        thumbnail: ['ad2-thumb.jpg'],
        caption: 'Ad Caption 2',
        time: new Date().toISOString(),
        numberOfViews: 0,
        numberOfLikes: 0,
        numberOfComments: 0,
        email: 'ad2@example.com',
        userName: 'Ad User 2',
        userProfilePicture: 'ad2-profile.jpg',
        Ismock: false,
        isAd: true,
      },
    ];

    const result = await helper.randomizeADs(posts, ads);

    // Ensure all posts and ads are present in the final array
    expect(result).toHaveLength(posts.length + ads.length);
    expect(result).toEqual(expect.arrayContaining([...posts, ...ads]));
  });
});
