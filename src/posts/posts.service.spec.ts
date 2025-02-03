// posts.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { Post } from 'src/data/Abstarcts/Schemas/posts.schema';

jest.mock('firebase/storage');
jest.mock('uuid');
jest.mock('fluent-ffmpeg');
jest.mock('fs');

describe('PostsService', () => {
  let service: PostsService;
  let postModel: Model<Post>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getStorage(),
          useValue: {
            ref: jest.fn(),
            uploadBytesResumable: jest.fn().mockResolvedValue({}),
          }
        },
        {
          provide: 'PostModel',
          useValue: {
            save: jest.fn().mockResolvedValue({}),
          }
        }
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postModel = module.get<Model<Post>>('PostModel');
  });

  describe('createPost', () => {
    const mockFile = {
      originalname: 'test.mp4',
      mimetype: 'video/mp4',
      buffer: Buffer.from('test'),
    } as Express.Multer.File;

    const mockDto = {
      videoId: '123',
      email:"guy@gmail.com",
      userId: '456',
      time: new Date().toISOString(),
      caption: 'Test caption'
    };

    beforeEach(() => {
      (uuidv4 as jest.Mock).mockReturnValue('mock-uuid');
      (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('test'));
      (fs.unlinkSync as jest.Mock).mockImplementation(() => {});
    });

    it('should successfully create a post', async () => {
      const result = await service.createPost(mockFile, mockDto);
      
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('newUser');
      expect(uploadBytesResumable).toHaveBeenCalledTimes(2);
      expect(postModel.save).toHaveBeenCalled();
    });

    it('should handle Firebase upload errors', async () => {
      (uploadBytesResumable as jest.Mock).mockRejectedValueOnce(new Error('Upload failed'));
      
      await expect(service.createPost(mockFile, mockDto))
        .rejects.toThrow('Failed to upload video');
    });

    it('should handle thumbnail generation errors', async () => {
      (ffmpeg as unknown as jest.Mock).mockImplementationOnce(() => ({
        setFfmpegPath: jest.fn().mockReturnThis(),
        setFfprobePath: jest.fn().mockReturnThis(),
        on: jest.fn().mockImplementation((event, handler) => {
          if (event === 'error') handler(new Error('FFmpeg error'));
          return this;
        }),
        screenshots: jest.fn()
      }));

      await expect(service.createPost(mockFile, mockDto))
        .rejects.toThrow('Failed to upload video');
    });

    it('should handle database save errors', async () => {
      (postModel.save as jest.Mock).mockRejectedValueOnce(new Error('DB error'));
      
      await expect(service.createPost(mockFile, mockDto))
        .rejects.toThrow('Failed to upload video');
    });

    it('should clean up temporary files', async () => {
      await service.createPost(mockFile, mockDto);
      
      expect(fs.unlinkSync).toHaveBeenCalledTimes(2);
    });
  });
});