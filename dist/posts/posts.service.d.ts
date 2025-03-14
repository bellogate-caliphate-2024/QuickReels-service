import { Logger } from '@nestjs/common';

import { CreatePostDto } from '../dtos/posts.dto';

import { Helper } from '../helpers/helper';
import { AwsS3Service } from '../DataBase/Aws';
import { Like } from '../Schemas/likes.schema';
import { Model } from 'mongoose';
export declare class PostsService {
    private readonly ACTION;
    private readonly likeModel;
    private readonly awsS3Service;
    logger: Logger;

    constructor(ACTION: Helper, likeModel: Model<Like>, awsS3Service: AwsS3Service);

    createPost(videoFile: Express.Multer.File, createDto: CreatePostDto): Promise<any>;
    getContents(page: number, limit: number): Promise<{
        currentPage: number;
        listOfContents: any[];
        isLastPage: boolean;
        nextPage: number | null;
    }>;
}
