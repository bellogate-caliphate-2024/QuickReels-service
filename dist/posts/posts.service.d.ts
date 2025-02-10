import { Model } from 'mongoose';
import { Post } from '../Schemas/posts.schema';
import { CreatePostDto } from '../posts.dto';
import { Helper } from '../helpers/helper';
export declare class PostsService {
    private readonly postModel;
    private ACTION;
    constructor(postModel: Model<Post>, ACTION: Helper);
    createPost(videoFile: Express.Multer.File, createDto: CreatePostDto): Promise<any>;
}
