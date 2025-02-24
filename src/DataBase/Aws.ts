import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsS3Service {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const fileKey = `${folder}/${uuidv4()}_${file.originalname}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || ' ',
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const uploadResult = await this.s3.upload(params).promise();
    return uploadResult.Location;
  }

  async uploadLocalFile(filePath: string, folder: string): Promise<string> {
    const fileKey = `${folder}/${uuidv4()}_${path.basename(filePath)}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || ' ',
      Key: fileKey,
      Body: require('fs').createReadStream(filePath),
    };

    const uploadResult = await this.s3.upload(params).promise();
    return uploadResult.Location;
  }
}
