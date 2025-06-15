import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery } from "@nestjs/swagger";
import { PostsService } from "../../posts/services/posts.service";

@Controller('users')
export  class UsersController{
constructor(private readonly postsService: PostsService) {}



 @Get('/getContents')
  @ApiOperation({ summary: 'Get paginated contents' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getContents(@Query('page') page: number, @Query('limit') limit: number) {
    return this.postsService.getContents(page, limit);
  }

}