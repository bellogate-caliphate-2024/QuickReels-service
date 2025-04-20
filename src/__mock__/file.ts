import { User } from '../../src/user/schema/user.schema';
import { Types } from 'mongoose';


export const mockFile = {
  fieldname: 'file',
  originalname: 'test.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  size: 1024,
  buffer: Buffer.from('test file content'),
  destination: '/uploads',
  filename: 'test.jpg',
  path: '/uploads/test.jpg',
} as Express.Multer.File;

export const mockUser = (user?: Partial<User>): User =>
  ({
    _id: new Types.ObjectId(),
    email: 'test@mail.com',
    password: 'hashedpass',
    userName: 'testuser',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...user,
    save: jest.fn().mockResolvedValue(true),
    toObject: jest.fn().mockReturnThis(),
  }) as unknown as User;

