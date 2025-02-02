import * as AWS from "aws-sdk"
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
const s3 = new AWS.S3();
(async () => {
    await s3.putObject({
        Body:"Hello world",
        Bucket:"qr-awsbucket",
        Key:"my-file.txt",
    }).promise();
    
})();
