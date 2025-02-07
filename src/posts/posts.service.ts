import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {


    async mock(){
        return "hello"
      }

}
