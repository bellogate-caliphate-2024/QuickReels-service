import { Logger } from '@nestjs/common';
import { CreatePostDto } from '../posts.dto';
import { Helper } from '../helpers/helper';
import { AwsS3Service } from '../DataBase/Aws';
export declare class PostsService {
    private readonly ACTION;
    private readonly awsS3Service;
    logger: Logger;
    constructor(ACTION: Helper, awsS3Service: AwsS3Service);
    createPost(videoFile: Express.Multer.File, createDto: CreatePostDto): Promise<any>;
    getContents(page: number, limit: number): Promise<{
        currentPage: number;
        listOfContents: any[];
        isLastPage: boolean;
        nextPage: number | null;
    }>;
}
