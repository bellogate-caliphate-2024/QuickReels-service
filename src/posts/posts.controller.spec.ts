jest.mock('firebase-admin');

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { CreatePostDto } from '../posts.dto';
import { mockFile } from '../__mock__/file';

describe('PostsController', () => {
  let controller: PostsController;
  let postsService: PostsService;

  beforeEach(() => {
    postsService = {
      createPost: jest.fn().mockResolvedValue({
        file: mockFile,
        message: 'Post created successfully',
      }),
    } as any;

    // Directly instantiate the controller with the mocked service
    controller = new PostsController(postsService);
  });

  it('should handle a POST request and return a file and a message', async () => {
    const createPostDto: CreatePostDto = {
      email: 'test@example.com',
      video_url: ['https://example.com/video.mp4'],
      thumbnail: ['https://example.com/thumbnail.jpg'],
      caption: 'This is a test post',
      time: '2023-10-01T12:00:00Z',
    };

    // Call the controller method
    const result = await controller.createPost(mockFile, createPostDto);

    // Test the response
    expect(result).toEqual({
      file: mockFile,
      message: 'Post created successfully',
    });

    // Test if the service method was called
    expect(postsService.createPost).toHaveBeenCalledWith(
      mockFile,
      createPostDto,
    );
  });

  it("should delete the specified video URL from the user's post", async () => {
    const email = 'test@example.com';
    const videoUrl = 'http://example.com/video.mp4';
    const message = `users${email} post ${videoUrl} succesfully deleted`;

    const result = await controller.deletePost(email, videoUrl);

    expect(result.message).toBe(message);
    expect(postsService).toHaveBeenCalledWith(email, videoUrl);
  });
});
