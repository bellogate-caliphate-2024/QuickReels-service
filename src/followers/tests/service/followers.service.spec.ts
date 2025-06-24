import { Test, TestingModule } from '@nestjs/testing';
import { FollowersService } from '../../services/followers.service';
import { FollowersRepository } from '../../repository/followers.repository';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateFollowerDto } from '../../dtos/followers.dto';

describe('FollowersService', () => {
  let service: FollowersService;
  let repository: FollowersRepository;

  const mockFollowersRepository = {
    findFollow: jest.fn(),
    createFollow: jest.fn(),
    deleteFollow: jest.fn(),
    getFollowersCount: jest.fn(),
    getFollowingCount: jest.fn(),
    getAllFollowers: jest.fn(),
    getAllFollowing: jest.fn(),
    getAllFollowRelationships: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowersService,
        {
          provide: FollowersRepository,
          useValue: mockFollowersRepository,
        },
      ],
    }).compile();

    service = module.get<FollowersService>(FollowersService);
    repository = module.get<FollowersRepository>(FollowersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('followUser', () => {
    const createFollowerDto: CreateFollowerDto = {
      followerEmail: 'follower@test.com',
      followingEmail: 'following@test.com',
    };

    it('should successfully follow a user', async () => {
      mockFollowersRepository.findFollow.mockResolvedValue(null);
      mockFollowersRepository.createFollow.mockResolvedValue(createFollowerDto);

      const result = await service.followUser(createFollowerDto);
      expect(result).toEqual(createFollowerDto);
      expect(mockFollowersRepository.findFollow).toHaveBeenCalledWith(
        createFollowerDto.followerEmail,
        createFollowerDto.followingEmail,
      );
      expect(mockFollowersRepository.createFollow).toHaveBeenCalledWith(
        createFollowerDto,
      );
    });

    it('should throw BadRequestException when user tries to follow themselves', async () => {
      const selfFollowDto = {
        followerEmail: 'same@test.com',
        followingEmail: 'same@test.com',
      };

      await expect(service.followUser(selfFollowDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockFollowersRepository.findFollow).not.toHaveBeenCalled();
      expect(mockFollowersRepository.createFollow).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when already following the user', async () => {
      mockFollowersRepository.findFollow.mockResolvedValue(createFollowerDto);

      await expect(service.followUser(createFollowerDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockFollowersRepository.createFollow).not.toHaveBeenCalled();
    });
  });

  describe('unfollowUser', () => {
    const followerEmail = 'follower@test.com';
    const followingEmail = 'following@test.com';

    it('should successfully unfollow a user', async () => {
      mockFollowersRepository.deleteFollow.mockResolvedValue(true);

      const result = await service.unfollowUser(followerEmail, followingEmail);
      expect(result).toEqual({ message: 'Successfully unfollowed user' });
      expect(mockFollowersRepository.deleteFollow).toHaveBeenCalledWith(
        followerEmail,
        followingEmail,
      );
    });

    it('should throw NotFoundException when follow relationship does not exist', async () => {
      mockFollowersRepository.deleteFollow.mockResolvedValue(false);

      await expect(
        service.unfollowUser(followerEmail, followingEmail),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getFollowersCount', () => {
    const userEmail = 'test@test.com';

    it('should return the correct followers count', async () => {
      const count = 5;
      mockFollowersRepository.getFollowersCount.mockResolvedValue(count);

      const result = await service.getFollowersCount(userEmail);
      expect(result).toEqual({ followersCount: count });
      expect(mockFollowersRepository.getFollowersCount).toHaveBeenCalledWith(
        userEmail,
      );
    });
  });

  describe('getFollowingCount', () => {
    const userEmail = 'test@test.com';

    it('should return the correct following count', async () => {
      const count = 3;
      mockFollowersRepository.getFollowingCount.mockResolvedValue(count);

      const result = await service.getFollowingCount(userEmail);
      expect(result).toEqual({ followingCount: count });
      expect(mockFollowersRepository.getFollowingCount).toHaveBeenCalledWith(
        userEmail,
      );
    });
  });

  describe('getAllFollowers', () => {
    const userEmail = 'test@test.com';
    const mockFollowers = [
      { email: 'follower1@test.com' },
      { email: 'follower2@test.com' },
    ];

    it('should return all followers for a user', async () => {
      mockFollowersRepository.getAllFollowers.mockResolvedValue(mockFollowers);

      const result = await service.getAllFollowers(userEmail);
      expect(result).toEqual(mockFollowers);
      expect(mockFollowersRepository.getAllFollowers).toHaveBeenCalledWith(
        userEmail,
      );
    });
  });

  describe('getAllFollowing', () => {
    const userEmail = 'test@test.com';
    const mockFollowing = [
      { email: 'following1@test.com' },
      { email: 'following2@test.com' },
    ];

    it('should return all users being followed', async () => {
      mockFollowersRepository.getAllFollowing.mockResolvedValue(mockFollowing);

      const result = await service.getAllFollowing(userEmail);
      expect(result).toEqual(mockFollowing);
      expect(mockFollowersRepository.getAllFollowing).toHaveBeenCalledWith(
        userEmail,
      );
    });
  });

  describe('getAllFollowRelationships', () => {
    const mockRelationships = [
      { followerEmail: 'user1@test.com', followingEmail: 'user2@test.com' },
      { followerEmail: 'user2@test.com', followingEmail: 'user3@test.com' },
    ];

    it('should return all follow relationships', async () => {
      mockFollowersRepository.getAllFollowRelationships.mockResolvedValue(
        mockRelationships,
      );

      const result = await service.getAllFollowRelationships();
      expect(result).toEqual(mockRelationships);
      expect(
        mockFollowersRepository.getAllFollowRelationships,
      ).toHaveBeenCalled();
    });
  });
});
