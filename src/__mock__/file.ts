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


