import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PostsRepository } from '../../repository/posts.repository';
import { PostsService } from '../../services/posts.service';
import { Model } from 'mongoose';
import { UpdatePostDto } from 'src/posts/dtos/update-post.dto';
import { AwsS3Service } from '../../../DataBase/Aws';
import { DatabaseHelper } from '../../../helpers/helper'; 
describe('PostsService & PostsRepository', () => {
  let repository: PostsRepository;
  let postModel: Model<any>;
  let postsService: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        PostsRepository,
        {
          provide: AwsS3Service,
          useValue: {
            uploadFile: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
        {
          provide: DatabaseHelper,
          useValue: {
            transformUrl: jest.fn((url) => url),
          },
        },
        {
          provide: getModelToken('Post'),
          useValue: {
            find: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            lean: jest.fn().mockReturnThis(),
            exec: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    postsService = module.get<PostsService>(PostsService);
    repository = module.get<PostsRepository>(PostsRepository);
    postModel = module.get<Model<any>>(getModelToken('Post'));
  });


  


  it('should call postsRepository.findByIdAndUpdate with correct args', async () => {
    const id = '123abc';
    const updateDto: UpdatePostDto = {
      caption: 'Updated caption',
      userName: 'updatedUser',
      isAd: true,
      isLiked: true,
      Ismock: false,
    };

    const expectedResult = { _id: id, ...updateDto, __v: 0 };

    jest
      .spyOn(repository, 'findByIdAndUpdate')
      .mockResolvedValue(expectedResult as any);

    const result = await postsService.updatePost(id, updateDto);

    expect(repository.findByIdAndUpdate).toHaveBeenCalledWith(id, updateDto);
    expect(result).toEqual(expectedResult);
  });
});
