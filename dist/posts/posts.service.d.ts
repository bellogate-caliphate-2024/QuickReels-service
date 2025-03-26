import { Logger } from '@nestjs/common';
import { CreatePostDto } from '../posts/dtos/posts.dto';
import { DatabaseHelper } from '../helpers/helper';
import { AwsS3Service } from '../DataBase/Aws';
import { Like } from '../likes/models/likes.schema';
import { Model } from 'mongoose';
export declare class PostsService {
    private readonly ACTION;
    private readonly awsS3Service;
    private readonly likeModel;
    logger: Logger;
    constructor(ACTION: DatabaseHelper, awsS3Service: AwsS3Service, likeModel: Model<Like>);
    createPost(videoFile: Express.Multer.File, createDto: CreatePostDto): Promise<any>;
    getContents(page: number, limit: number): Promise<{
        currentPage: number;
        listOfContents: any[];
        isLastPage: boolean;
        nextPage: number | null;
    }>;
    searchPosts(query: string): Promise<unknown[]>;
}
