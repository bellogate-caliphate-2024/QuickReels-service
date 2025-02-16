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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const posts_schema_1 = require("../Schemas/posts.schema");
const helper_1 = require("../helpers/helper");
const uuid_1 = require("uuid");
const path = require("path");
let PostsService = class PostsService {
    constructor(postModel, ACTION) {
        this.postModel = postModel;
        this.ACTION = ACTION;
    }
    async createPost(videoFile, createDto) {
        const tempDir = path.join(__dirname, 'tmp');
        let videoFilePath;
        let thumbnailPath;
        try {
            videoFilePath = this.ACTION.saveTempFile(videoFile.buffer, `video-${Date.now()}_${(0, uuid_1.v4)()}_${videoFile.originalname}`);
            const videoUrl = await this.ACTION.uploadVideoToFirebase(videoFile, videoFilePath);
            thumbnailPath = await this.ACTION.generateThumbnail(videoFilePath, tempDir);
            const thumbnailUrl = await this.ACTION.uploadThumbnailToFirebase(thumbnailPath);
            if (!createDto.email) {
                throw new Error('Email is required to create a post.');
            }
            let existingPost = await this.postModel.findOne({ email: createDto.email });
            if (existingPost) {
                existingPost.video_url.push(videoUrl);
                existingPost.thumbnail.push(thumbnailUrl);
                existingPost.time = new Date().toISOString();
                if (createDto.caption) {
                    existingPost.caption = createDto.caption;
                }
                await existingPost.save();
                return {
                    message: 'Video and thumbnail successfully added to your posts.',
                    newPost: existingPost,
                };
            }
            else {
                const newPost = await this.postModel.create({
                    email: createDto.email,
                    caption: createDto.caption,
                    videoUrl: [videoUrl],
                    thumbnailUrl: [thumbnailUrl],
                    Ismock: createDto.Ismock,
                    time: createDto.time,
                });
                console.log('Saved Post:', newPost);
                return {
                    message: 'Video and thumbnail successfully uploaded and stored.',
                    newPost,
                };
            }
        }
        catch (error) {
            console.error('Error uploading video:', error);
            throw new Error(error.message || 'Failed to upload video');
        }
    }
    async getContents(email, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const posts = await this.postModel
                .find({}, { video_url: 1, email: 1, Ismock: 1, _id: 0 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec();
            const mockVideos = [];
            const regularVideos = [];
            posts.forEach(post => {
                post.video_url.forEach((video) => {
                    if (post.Ismock) {
                        mockVideos.push({ [post.email]: video });
                    }
                    else {
                        regularVideos.push({ [post.email]: video });
                    }
                });
            });
            const videos = [];
            let i = 0;
            let j = 0;
            while (i < mockVideos.length || j < regularVideos.length) {
                if (i < mockVideos.length) {
                    videos.push(mockVideos[i++]);
                }
                if (j < regularVideos.length) {
                    videos.push(regularVideos[j++]);
                }
            }
            const totalVideos = videos.length;
            console.log(videos);
            return {
                currentPage: page,
                totalPages: Math.ceil(totalVideos / limit),
                totalVideos,
                videos
            };
        }
        catch (error) {
            throw new Error('Failed to retrieve contents');
        }
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(posts_schema_1.Post.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        helper_1.Helper])
], PostsService);
//# sourceMappingURL=posts.service.js.map