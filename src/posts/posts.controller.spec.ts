// posts.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { BadRequestException } from '@nestjs/common';
import { CreatePostDto } from 'src/data/Abstarcts/posts.dto';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            createPost: jest.fn().mockResolvedValue({
              message: 'Success',
              newUser: {}
            })
          }
        }
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  describe('createPost', () => {
    it('should successfully create a post', async () => {
      const mockFile = {
        originalname: 'test.mp4',
        mimetype: 'video/mp4',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const dto = {
        videoId: '123',
        email:'',
        userId: '456',
        time: new Date().toISOString(),
        caption: 'Test caption'
      };

      await expect(controller.createPost(mockFile, dto)).resolves.toEqual({
        message: 'Success',
        newUser: {}
      });
      expect(service.createPost).toHaveBeenCalledWith(mockFile, dto);
    });

    it('should throw BadRequestException when no file is uploaded', async () => {
      await expect(controller.createPost(null as unknown as Express.Multer.File, {} as any))
        .rejects.toThrow(BadRequestException);
    });
  });
});