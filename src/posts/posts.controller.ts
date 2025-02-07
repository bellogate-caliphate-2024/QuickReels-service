import { Controller, Get } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
  export class PostsController {
    constructor(private readonly postService: PostsService) {}
  

    @Get('/hello')
    async mockdata(){
      return await this.postService.mock();
    }
  }
