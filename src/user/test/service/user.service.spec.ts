import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../../service/user.service';
import { UserRepository } from '../../reposiotry/user.repository';
import { CloudinaryService } from '../../../infrastructure/cloudinary/cloudinary.service';
import { User } from '../../schema/user.schema';

describe('UserService', () => {
  let service: UserService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
        {
          provide: CloudinaryService,
          useValue: {
            uploadFile: jest.fn(),
            deleteFile: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
