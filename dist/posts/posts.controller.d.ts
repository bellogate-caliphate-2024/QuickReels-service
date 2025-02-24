import { CreatePostDto } from '../posts.dto';
import { PostsService } from './posts.service';
export declare class PostsController {
    private readonly postService;
    constructor(postService: PostsService);
    createPost(videoFile: Express.Multer.File, createPostDto: CreatePostDto, userProfilePicture: string, numberOfViews: number, numberOfLikes: number, numberOfComments: number): Promise<any>;
    getContents(page: number, limit: number): Promise<{
        currentPage: number;
        listOfContents: any[];
        isLastPage: boolean;
        nextPage: number | null;
    }>;
}
