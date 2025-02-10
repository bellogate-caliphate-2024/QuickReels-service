import { Model } from 'mongoose';
import { Post } from '../Schemas/posts.schema';
import { Helper } from '../helpers/helper';
export declare class PostsService {
    private readonly postModel;
    private ACTION;
    constructor(postModel: Model<Post>, ACTION: Helper);
}
