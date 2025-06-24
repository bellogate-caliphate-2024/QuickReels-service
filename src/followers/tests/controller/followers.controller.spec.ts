import { Test, TestingModule } from '@nestjs/testing';
import { FollowersController } from '../../controllers/followers.controller';
import { FollowersService } from '../../services/followers.service';
import { CreateFollowerDto } from '../../dtos/followers.dto';

describe('FollowersController', () => {
  let controller: FollowersController;
  let service: FollowersService;

  const mockFollowersService = {
    followUser: jest.fn(),
    unfollowUser: jest.fn(),
    getFollowersCount: jest.fn(),
    getFollowingCount: jest.fn(),
    getAllFollowers: jest.fn(),
    getAllFollowing: jest.fn(),
    getAllFollowRelationships: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FollowersController],
      providers: [
        {
          provide: FollowersService,
          useValue: mockFollowersService,
        },
      ],
    }).compile();

    controller = module.get<FollowersController>(FollowersController);
    service = module.get<FollowersService>(FollowersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('followUser', () => {
    const createFollowerDto: CreateFollowerDto = {
      followerEmail: 'follower@test.com',
      followingEmail: 'following@test.com',
    };

    it('should successfully follow a user', async () => {
      const expectedResult = { ...createFollowerDto };
      mockFollowersService.followUser.mockResolvedValue(expectedResult);

      const result = await controller.followUser(createFollowerDto);
      expect(result).toEqual(expectedResult);
      expect(mockFollowersService.followUser).toHaveBeenCalledWith(
        createFollowerDto,
      );
    });
  });

  describe('unfollowUser', () => {
    const followerEmail = 'follower@test.com';
    const followingEmail = 'following@test.com';

    it('should successfully unfollow a user', async () => {
      const expectedResult = { message: 'Successfully unfollowed user' };
      mockFollowersService.unfollowUser.mockResolvedValue(expectedResult);

      const result = await controller.unfollowUser(
        followerEmail,
        followingEmail,
      );
      expect(result).toEqual(expectedResult);
      expect(mockFollowersService.unfollowUser).toHaveBeenCalledWith(
        followerEmail,
        followingEmail,
      );
    });
  });

  describe('getFollowersCount', () => {
    const userEmail = 'test@test.com';

    it('should return followers count', async () => {
      const expectedResult = { followersCount: 5 };
      mockFollowersService.getFollowersCount.mockResolvedValue(expectedResult);

      const result = await controller.getFollowersCount(userEmail);
      expect(result).toEqual(expectedResult);
      expect(mockFollowersService.getFollowersCount).toHaveBeenCalledWith(
        userEmail,
      );
    });
  });

  describe('getFollowingCount', () => {
    const userEmail = 'test@test.com';

    it('should return following count', async () => {
      const expectedResult = { followingCount: 3 };
      mockFollowersService.getFollowingCount.mockResolvedValue(expectedResult);

      const result = await controller.getFollowingCount(userEmail);
      expect(result).toEqual(expectedResult);
      expect(mockFollowersService.getFollowingCount).toHaveBeenCalledWith(
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

    it('should return all followers', async () => {
      mockFollowersService.getAllFollowers.mockResolvedValue(mockFollowers);

      const result = await controller.getAllFollowers(userEmail);
      expect(result).toEqual(mockFollowers);
      expect(mockFollowersService.getAllFollowers).toHaveBeenCalledWith(
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

    it('should return all following users', async () => {
      mockFollowersService.getAllFollowing.mockResolvedValue(mockFollowing);

      const result = await controller.getAllFollowing(userEmail);
      expect(result).toEqual(mockFollowing);
      expect(mockFollowersService.getAllFollowing).toHaveBeenCalledWith(
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
      mockFollowersService.getAllFollowRelationships.mockResolvedValue(
        mockRelationships,
      );

      const result = await controller.getAllFollowRelationships();
      expect(result).toEqual(mockRelationships);
      expect(mockFollowersService.getAllFollowRelationships).toHaveBeenCalled();
    });
  });
});
