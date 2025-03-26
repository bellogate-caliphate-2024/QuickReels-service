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
const elasticsearch_client_1 = require("../config/elasticsearch.client");
let PostsService = PostsService_1 = class PostsService {
    constructor(ACTION, awsS3Service, likeModel) {
        this.ACTION = ACTION;
        this.awsS3Service = awsS3Service;
        this.likeModel = likeModel;
        this.logger = new common_1.Logger(PostsService_1.name);
    }
    async createPost(videoFile, createDto) {
        const tempDir = path.join(__dirname, 'tmp');
        let videoFilePath;
        let thumbnailPath;
        let videoUrl;
        let thumbnailUrl;
        try {
            videoUrl = await this.awsS3Service.uploadFile(videoFile, 'videos');
            videoFilePath = await this.ACTION.saveTempFile(videoFile.buffer, `video-${Date.now()}_${(0, uuid_1.v4)()}_${videoFile.originalname}`);
            thumbnailPath = await this.ACTION.generateThumbnail(videoFilePath, tempDir);
            thumbnailUrl = await this.awsS3Service.uploadLocalFile(thumbnailPath, 'thumbnails');
            const formattedTime = (0, date_fns_1.format)(new Date(), 'MM/dd/yyyy');
            const updatedDto = {
                ...createDto,
                time: formattedTime,
            };
            const newUser = await this.ACTION.saveToDatabase(updatedDto);
            await elasticsearch_client_1.default.index({
                index: 'quickreels',
                id: newUser._id.toString(),
                document: {
                    title: createDto.caption,
                    uploader: createDto.userName,
                    upload_date: new Date(),
                },
            });
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
            const alternatedPosts = this.ACTION.alternateMockPosts(posts);
            const allVideos = this.ACTION.flattenVideos(alternatedPosts);
            const paginatedVideos = allVideos.slice(skip, skip + limit);
            const isLastPage = skip + limit >= allVideos.length;
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
    async searchPosts(query) {
        try {
            const { hits } = await elasticsearch_client_1.default.search({
                index: 'quickreels',
                query: {
                    match: { title: query },
                },
            });
            return hits.hits.map((hit) => hit._source);
        }
        catch (error) {
            throw new Error('Failed to search posts');
        }
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = PostsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_2.InjectModel)(likes_schema_1.Like.name)),
    __metadata("design:paramtypes", [helper_1.DatabaseHelper,
        Aws_1.AwsS3Service,
        mongoose_1.Model])
], PostsService);
//# sourceMappingURL=posts.service.js.map