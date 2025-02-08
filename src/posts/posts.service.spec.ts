// posts.service.spec.ts
jest.mock('firebase-admin');

import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import * as admin from 'firebase-admin';
import { mockFile } from '../__mock__/file'; 
import { CreatePostDto } from '../posts.dto'; 

// Mock Firestore
const mockFirestore = {
  collection: jest.fn().mockReturnThis(),
  doc: jest.fn().mockReturnThis(),
  set: jest.fn().mockResolvedValue({}),
};

(admin.firestore as unknown as jest.Mock) = jest.fn(() => mockFirestore);
(admin.credential.cert as jest.Mock) = jest.fn(() => ({}));

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostsService],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should create a post and return a file and a message', async () => {
    const mockPost: CreatePostDto = {
      email: 'test@example.com',
      video_url: ['https://example.com/video.mp4'],
      thumbnail: ['https://example.com/thumbnail.jpg'],
      caption: 'This is a test post',
      time: '2023-10-01T12:00:00Z',
    };
    const mockMessage = 'Post created successfully';

    // Mock the service method to return the mock file and a message
    jest.spyOn(service, 'createPost').mockResolvedValue({
      file: mockFile,
      message: mockMessage,
    });

    // Pass the mock file and post data to the service method
    const result = await service.createPost(mockFile, mockPost);

    // Test the return value
    expect(result).toEqual({
      file: mockFile,
      message: mockMessage,
    });

    // Test if the service method was called with the correct input
    expect(service.createPost).toHaveBeenCalledWith(mockFile, mockPost);
  });
});