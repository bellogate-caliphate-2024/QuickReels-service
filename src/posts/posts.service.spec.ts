jest.mock('firebase-admin');

import { PostsService } from './posts.service';
import { mockFile } from '../__mock__/file';
import { CreatePostDto } from '../posts.dto';

describe('PostsService', () => {
  let service: PostsService;

  const mockPostModel = {
    create: jest.fn().mockResolvedValue({}),
  };
  const mockHelper = {
    someHelperMethod: jest.fn(),
  };

  beforeEach(() => {
    service = new PostsService(mockPostModel as any, mockHelper as any);
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

  it("should delete the specified video URL from the user's post", async () => {
    const email = 'test@example.com';
    const videoUrl = 'http://example.com/video.mp4';
    const user = {
      email,
      videoUrl: [videoUrl, 'http://example.com/othervideo.mp4'],
      save: jest.fn(),
    };

    const result = await service.deletePost('email', videoUrl);

    expect(user.save).toBeTruthy();
    expect(result.message).toBe(
      `User ${email}'s post ${videoUrl} successfully deleted`,
    );
  });

  it('should throw an error if the user is not found', async () => {
    const email = 'existent@example.com';
    const videoUrl = 'http://example.com/video.mp4';

    expect(service.deletePost(email, videoUrl)).resolves.toBeTruthy();
  });
});
