import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../controller/auth.controller';
import { AuthService } from '../../service/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    signUp: jest.fn(),
    signin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
