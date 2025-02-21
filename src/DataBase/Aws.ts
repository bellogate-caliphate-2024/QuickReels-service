import * as AWS from 'aws-sdk';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import {config} from "dotenv"
// (async () => {
//     await s3.putObject({
//         Body:"Hello world",
//         Bucket:"qr-awsbucket",
//         Key:"my-file.txt",
//     }).promise();

// })();

export class awsUpload {
  private s3 = new S3Client({
    region: process.env.AWS_REGION ?? " ",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? " ",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? " ",
    },
  });

   async uploadToS3(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<string> {
    const bucketName = process.env.AWS_BUCKET_NAME;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: 'public-read', // Make file publicly accessible
    });


    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  }
}
 