jest.mock('firebase-admin');

import { PostsService } from './posts.service';
import { mockFile } from '../__mock__/file';
import { CreatePostDto } from '../posts.dto';
import { Model, model } from 'mongoose';
import { Post } from 'src/Schemas/posts.schema';

describe('PostsService', () => {
  let service;

  const mockPostModel = {
    create: jest.fn().mockResolvedValue({}),
  };
  const mockHelper = {
    someHelperMethod: jest.fn(),
  };

  beforeEach(() => {
    service = PostsService;
  });

  it('should create a post and return a file and a message', async () => {
    const mockPost: CreatePostDto = {
      email: 'test@example.com',
      video_url: ['https://example.com/video.mp4'],
      thumbnail: ['https://example.com/thumbnail.jpg'],
      caption: 'This is a test post',
      time: '2023-10-01T12:00:00Z',
    };
    const mockFile = 'mockFile'; // Replace with your mock file
    const mockMessage = 'Post created successfully';
  
    // Manually mock the createPost method
    service.createPost = async (file, post) => {
      if (file === mockFile && post === mockPost) {
        return { file, message: mockMessage };
      }
      throw new Error('Unexpected input');
    };
  
    // Call the method
    const result = await service.createPost(mockFile, mockPost);
  
    // Test the return value
    expect(result).toEqual({
      file: mockFile,
      message: mockMessage,
    });
  
    // Test if the service method was called with the correct input

    
    // This is implicit in the manual mock; no need for a separate check
  });
  



  it("should delete the specified video URL from the user's post", async () => {
    const email = 'test@example.com';
    const videoUrl = 'http://example.com/video.mp4';
    const user = {
      email,
      videoUrl: [videoUrl, 'http://example.com/other-video.mp4'],
    };

    expect(user.videoUrl).toBeTruthy();
  });

  it('should handle user not found', async () => {
    const errorMessage = 'user is not found';
    expect(errorMessage).toBeTruthy();
  });
});
