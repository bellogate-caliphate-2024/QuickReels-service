"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PostsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const helper_1 = require("../helpers/helper");
const uuid_1 = require("uuid");
const path = require("path");
const date_fns_1 = require("date-fns");
const Aws_1 = require("../DataBase/Aws");
const likes_schema_1 = require("../Schemas/likes.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let PostsService = PostsService_1 = class PostsService {
    constructor(ACTION, likeModel, awsS3Service) {
        this.ACTION = ACTION;
        this.likeModel = likeModel;
        this.awsS3Service = awsS3Service;
        this.logger = new common_1.Logger(PostsService_1.name);
    }
    async createPost(videoFile, createDto) {
        const tempDir = path.join(__dirname, 'tmp');
        let videoFilePath;
        let thumbnailPath;
        try {
            videoFilePath = await this.ACTION.saveTempFile(videoFile.buffer, `video-${Date.now()}_${(0, uuid_1.v4)()}_${videoFile.originalname}`);
            thumbnailPath = await this.ACTION.generateThumbnail(videoFilePath, tempDir);
            const formattedTime = (0, date_fns_1.format)(new Date(), 'MM/dd/yyyy');
            const updatedDto = {
                ...createDto,
                time: formattedTime,
            };
            const newUser = await this.ACTION.saveToDatabase(updatedDto);
            return {
                message: 'User video, thumbnail, and profile picture successfully uploaded and stored in AWS S3 and MongoDB',
                newUser,
            };
        }
        catch (error) {
            throw new Error('Failed to upload video');
        }
    }
    async getContents(page, limit) {
        try {
            const skip = (page - 1) * limit;
            const posts = await this.ACTION.fetchAllPosts();
            console.log('posts', posts);
            const alternatedPosts = this.ACTION.alternateMockPosts(posts);
            const allVideos = this.ACTION.flattenVideos(alternatedPosts);
            const contentIds = allVideos.map((video) => video.id);
            const likeCounts = await this.likeModel.aggregate([
                { $match: { contentId: { $in: contentIds } } },
                { $group: { _id: "$contentId", count: { $sum: 1 } } }
            ]);
            const likeMap = new Map(likeCounts.map((like) => [like._id, like.count]));
            const updatedVideos = allVideos.map((video) => ({
                ...video,
                numberOfLikes: likeMap.get(video.id) || 0,
            }));
            const paginatedVideos = updatedVideos.slice(skip, skip + limit);
            const isLastPage = skip + limit >= updatedVideos.length;
            return {
                currentPage: page,
                listOfContents: paginatedVideos,
                isLastPage,
                nextPage: isLastPage ? null : page + 1,
            };
        }
        catch (error) {
            throw new Error('Failed to retrieve contents');
        }
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = PostsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_2.InjectModel)(likes_schema_1.Like.name)),
    __metadata("design:paramtypes", [helper_1.Helper,
        mongoose_1.Model,
        Aws_1.AwsS3Service])
], PostsService);
//# sourceMappingURL=posts.service.js.map