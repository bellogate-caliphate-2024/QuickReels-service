import { BadRequestException, ConflictException, InternalServerErrorException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Post } from "src/data/Abstarcts/Schemas/posts.schema";

@Injectable() // ✅ Required for NestJS dependency injection
export class Helper {
  private logger = new Logger(Helper.name); // ✅ Correct logger usage

  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>, // ✅ Injecting Mongoose Model
  ) {}

  async saveToDatabase(postData: Partial<Post>) {
    try {
      const createdPost = new this.postModel(postData);
      return await createdPost.save();
    } catch (error) {
      this.logger.error(`Database save failed: ${error.message}`, error.stack);
      throw this.handleError(error);
    }
  }



  async deletePost(id: string) {
    try {
      const deletedPost = await this.postModel.findByIdAndDelete(id).exec();
      
      if (!deletedPost) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      return deletedPost;
    } catch (error) {
      this.logger.error(`Database delete failed: ${error.message}`, error.stack);
      throw this.handleError(error);
    }
  }

  async handleError(error: any) {
    if (error.code === 11000) {
      throw new ConflictException("Duplicate video ID detected");
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      throw new BadRequestException(messages);
    }

    if (error.name === "MongoNetworkError") {
      throw new InternalServerErrorException("Database connection failed");
    }

    throw new InternalServerErrorException("Failed to create post");
  }


   async uploadToAWS(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    // Mock implementation
    return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${folder}/${Date.now()}-${file.originalname}`;
  }

}
