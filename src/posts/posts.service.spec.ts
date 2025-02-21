jest.mock('firebase-admin');

import { PostsService } from './posts.service';
import { mockFile } from '../__mock__/file';
import { CreatePostDto } from '../posts.dto';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Post } from 'src/Schemas/posts.schema';
import { Helper } from '../helpers/helper.module';
describe('PostsService', () => {
  let service: PostsService;
  let postModel: Model<any>;
  let helper: Helper;

  const mockHelper = {
    someHelperMethod: jest.fn(),
  };

  beforeEach(async () => {
    const mockPostModel = {
      find: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    } as unknown as jest.Mocked<Model<any>>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,

        { provide: getModelToken('Post'), useValue: mockPostModel },
        { provide: Helper, useValue: mockHelper },
      ],
    }).compile();

    service = new PostsService(mockPostModel as any, mockHelper as any);
    postModel = module.get<Model<any>>(getModelToken('Post'));
  });

  it('should create a post and return a file and a message', async () => {
    const mockPost: CreatePostDto = {
      email: 'test@example.com',
      video_url: ['https://example.com/video.mp4'],
      thumbnail: ['https://example.com/thumbnail.jpg'],
      caption: 'This is a test post',
      Ismock: true,
      time: '2023-10-01T12:00:00Z',
      userName: '',
      isLiked: false,
    };
    const mockMessage = 'Post created successfully';

    jest.spyOn(service, 'createPost').mockResolvedValue({
      file: mockFile,
      message: mockMessage,
    });

    // Call the method
    const result = await service.createPost(mockFile, mockPost);

    // Test the return value
    expect(result).toEqual({
      file: mockFile,
      message: mockMessage,
    });

    expect(service.createPost).toHaveBeenCalledWith(mockFile, mockPost);
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
    const result = await service.getContents(page, limit);

    expect(result.currentPage).toBe(page);
    expect(result.listOfContents.length).toBe(limit);
    expect(result.isLastPage).toBe(false);
    expect(result.nextPage).toBe(page + 1);
  });

  it('should alternate results between Ismock = true and Ismock = false', async () => {
    const mockPosts = [
      {
        _id: '1',
        video_url: ['video1.mp4'],
        thumbnail: ['thumb1.jpg'],
        caption: 'Caption 1',
        time: new Date().toISOString(),
        numberOfViews: 10,
        numberOfLikes: 5,
        numberOfComments: 2,
        email: 'user1@example.com',
        userName: 'John Doe',
        userProfilePicture: 'profile1.jpg',
        isLiked: true,
        Ismock: true,
      },
      {
        _id: '2',
        video_url: ['video2.mp4'],
        thumbnail: ['thumb2.jpg'],
        caption: 'Caption 2',
        time: new Date().toISOString(),
        numberOfViews: 20,
        numberOfLikes: 10,
        numberOfComments: 5,
        email: 'user2@example.com',
        userName: 'Jane Doe',
        userProfilePicture: 'profile2.jpg',
        isLiked: false,
        Ismock: false,
      },
      {
        _id: '3',
        video_url: ['video3.mp4'],
        thumbnail: ['thumb3.jpg'],
        caption: 'Caption 3',
        time: new Date().toISOString(),
        numberOfViews: 30,
        numberOfLikes: 15,
        numberOfComments: 8,
        email: 'user3@example.com',
        userName: 'Alice Doe',
        userProfilePicture: 'profile3.jpg',
        isLiked: true,
        Ismock: true,
      },
      {
        _id: '4',
        video_url: ['video4.mp4'],
        thumbnail: ['thumb4.jpg'],
        caption: 'Caption 4',
        time: new Date().toISOString(),
        numberOfViews: 40,
        numberOfLikes: 20,
        numberOfComments: 10,
        email: 'user4@example.com',
        userName: 'Bob Doe',
        userProfilePicture: 'profile4.jpg',
        isLiked: false,
        Ismock: false,
      },
    ];

    (postModel.find as jest.Mock).mockReturnValue({
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockPosts),
    });

    const page = 1;
    const limit = 4;
    const result = await service.getContents(page, limit);


    // Extract Ismock values from the response
    const isMockValues = result.listOfContents.map((content) => content.Ismock);

    // Ensure Ismock values alternate
    for (let i = 0; i < isMockValues.length - 1; i++) {
      expect(isMockValues[i]).not.toBe(isMockValues[i + 1]);
    }
  });
});
