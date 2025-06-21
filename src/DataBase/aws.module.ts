import { Module } from '@nestjs/common';
import { AwsS3Service } from './Aws';

@Module({
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AWSModule {}
export { AwsS3Service };
