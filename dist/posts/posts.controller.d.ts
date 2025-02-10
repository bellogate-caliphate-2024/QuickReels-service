import { CreatePostDto } from '../posts.dto';
import { PostsService } from './posts.service';
export declare class PostsController {
    private readonly postService;
    constructor(postService: PostsService);
    createPost(videoFile: Express.Multer.File, createPostDto: CreatePostDto): Promise<any>;
}
