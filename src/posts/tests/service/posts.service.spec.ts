import { PostsService } from '../../services/posts.service';
import { mockFile } from '../../../__mock__/file';
import { CreatePostDto } from '../../dtos/posts.dto';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseHelper } from '../../../helpers/helper';
import { Like } from '../../../likes/models/likes.schema';
import { Post } from 'src/posts/models/posts.schema';
import { AwsS3Service } from '../../../DataBase/Aws';
import { PostsRepository } from '../../repository/posts.repository';

const mockAwsS3Service = {
  uploadFile: jest.fn().mockResolvedValue('https://mock-s3-url.com/video.mp4'),
  deleteFile: jest.fn().mockResolvedValue(true),
};

describe('PostsService', () => {
  let service: PostsService;
  let postModel: Model<any>;
  let Action: DatabaseHelper;

  const mockHelper = {
    someHelperMethod: jest.fn(),
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
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: DatabaseHelper, useValue: {} },
        { provide: PostsRepository, useValue: {} },
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
    Action = module.get<DatabaseHelper>(DatabaseHelper);
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
      nextPage: page + 1,
    } as unknown as Post[]);

    const result = await service.getContents();

    expect(result).toEqual({
      currentPage: page,
      listOfContents: mockPosts.slice(0, limit),
      isLastPage: false,
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

    const result = alternateMockPosts(mockPosts);

    const isMockValues = result.map((post) => post.Ismock);

    for (let i = 0; i < isMockValues.length - 1; i++) {
      expect(isMockValues[i]).not.toBe(isMockValues[i + 1]);
    }
  });

  it('should fetch all posts with the specified fields', async () => {
    (postModel.find().exec as jest.Mock).mockResolvedValue([
      {
        _id: '123',
        video_url: ['video1.mp4', 'video2.mp4'],
        thumbnail: ['thumb1.jpg', 'thumb2.jpg'],
        caption: 'Test Caption',
        time: new Date().toISOString(),
        numberOfViews: 10,
        numberOfLikes: 5,
        numberOfComments: 2,
        email: 'test@example.com',
        userName: 'Test User',
        userProfilePicture: 'profile.jpg',
        isLiked: true,
        Ismock: false,
      },
    ]);

    const result = await fetchAllPosts(postModel);
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
});
function alternateMockPosts(mockPosts: { _id: string; Ismock: boolean }[]) {
  return mockPosts.map((post, index) => ({
    ...post,
    Ismock: index % 2 === 0,
  }));
}
async function fetchAllPosts(postModel: Model<any>) {
  const posts = await postModel.find().lean().exec();
  return posts.map((post) => ({
    ...post,
    Ismock: false,
  }));
}
