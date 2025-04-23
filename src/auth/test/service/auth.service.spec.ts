import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../service/auth.service';
import { UsersService } from '../../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { mockUser } from '../../../__mock__/file';
import { Types } from 'mongoose';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn().mockImplementation((dto) =>
              mockUser({
                ...dto,
                _id: new Types.ObjectId(),
                password: bcrypt.hashSync(dto.password, 10),
              }),
            ),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-token'),
            signAsync: jest.fn().mockResolvedValue('mock-token'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    it('should hash password and create user', async () => {
      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      const result = await authService.signUp({
        email: 'test@example.com',
        password: 'plainPass',
      });

      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(usersService.createUser).toHaveBeenCalled();
      expect(result.accessToken).toBe('mock-token');
      expect(result.email).toBe('test@example.com');
    });
  });

  describe('signin', () => {
    it('should throw if password is invalid', async () => {
      const validUser = mockUser({
        email: 'test@mail.com',
        password: await bcrypt.hash('realpass', 10),
      });

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(validUser);

      await expect(
        authService.signin({
          email: 'test@mail.com',
          password: 'wrongpass',
          userName: 'testuser',
        }),
      ).rejects.toThrow('Invalid Password!......Please try again...');
    });

    it('should return token if credentials are valid', async () => {
      const validUser = mockUser({
        email: 'test@mail.com',
        password: await bcrypt.hash('correctpass', 10),
        userName: 'testuser',
      });

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(validUser);

      const result = await authService.signin({
        email: 'test@mail.com',
        password: 'correctpass',
        userName: 'testuser',
      });

      expect(result.accessToken).toBe('mock-token');
    });
  });

  describe('generateToken', () => {
    it('should return a signed token with user data', async () => {
      const user = mockUser({
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        email: 'user@mail.com',
        userName: 'User123',
      });

      const result = await authService.generateToken(user);

      expect(jwtService.sign).toBeDefined();

      expect(result).toHaveProperty('accessToken');
    });
  });
});
