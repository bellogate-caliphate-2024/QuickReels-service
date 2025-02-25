// src/__mock__/file.ts
export const mockFile = {
  fieldname: 'file',
  originalname: 'test.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  size: 1024,
  buffer: Buffer.from('test file content'), // Simulate file content
  destination: '/uploads',
  filename: 'test.jpg',
  path: '/uploads/test.jpg',
} as Express.Multer.File; // Cast to Multer's File type
