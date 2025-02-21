import { Model } from 'mongoose';
import { Post } from '../Schemas/posts.schema';
import { CreatePostDto } from '../posts.dto';
import { Helper } from '../helpers/helper';
export declare class PostsService {
    private postModel;
    private ACTION;
    constructor(postModel: Model<Post>, ACTION: Helper);
    createPost(videoFile: Express.Multer.File, createDto: CreatePostDto): Promise<any>;
    getContents(page: number, limit: number): Promise<{
        currentPage: number;
        nextPage: number | null;
        isLastPage: boolean;
        listOfContents: any[];
    }>;
}
