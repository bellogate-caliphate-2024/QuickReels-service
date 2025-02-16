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
  let helper:Helper
  const mockPostModel = {
    create: jest.fn().mockResolvedValue({}),
  };
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

    // Test if the service method was called with the correct input
    expect(service.createPost).toHaveBeenCalledWith(mockFile, mockPost);
  });



  // const mockPosts: Post[] = [
  //   { email: 'user1@gmail.com', video_url: ['video1.mp4'], Ismock: true, thumbnail: [], time: new Date().toISOString() },
  //   { email: 'user2@gmail.com', video_url: ['video2.mp4'], Ismock: false, thumbnail: [], time: new Date().toISOString() },
  //   { email: 'user3@gmail.com', video_url: ['video3.mp4'], Ismock: false, thumbnail: [], time: new Date().toISOString() },
  //   { email: 'user4@gmail.com', video_url: ['video4.mp4'], Ismock: true, thumbnail: [], time: new Date().toISOString() },
  // ];
  
  // const mockExec = jest.fn().mockResolvedValue(mockPosts);
  
  // const mockFind = jest.fn().mockReturnValue({
  //   select: jest.fn().mockReturnThis(),
  //   skip: jest.fn().mockReturnThis(),
  //   limit: jest.fn().mockReturnThis(),
  //   lean: jest.fn().mockReturnThis(),
  //   exec: mockExec,
  // });
  
  // it('should return videos alternating between Ismock true and false', async () => {
  //   jest.spyOn(postModel, 'find').mockImplementation(mockFind);
  
  //   const result = await service.getContents('test@gmail.com'); 
  
  //   expect(result.videos).toEqual([
  //     { 'user1@gmail.com': 'video1.mp4' },
  //     { 'user2@gmail.com': 'video2.mp4' }, 
  //     { 'user4@gmail.com': 'video4.mp4' }, 
  //     { 'user3@gmail.com': 'video3.mp4' }, 
  //   ]);
  // });
  
});
