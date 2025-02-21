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
const date_fns_1 = require("date-fns");
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
            const profilePictureUrl = createDto.userProfilePicture;
            createDto.time = new Date().toISOString();
            const formattedTime = (0, date_fns_1.format)(new Date(createDto.time), 'MM/dd/yyyy');
            createDto.time = formattedTime;
            const updatedDto = {
                ...createDto,
                video_url: [videoUrl],
                thumbnail: [thumbnailUrl],
                userProfilePicture: profilePictureUrl,
            };
            const newUser = await this.ACTION.saveToDatabase(updatedDto);
            return {
                message: 'User video, thumbnail, and profile picture successfully uploaded and stored in Firebase and MongoDB',
                newUser,
            };
        }
        catch (error) {
            console.error('Error uploading video:', error);
            throw new Error('Failed to upload video');
        }
    }
    async getContents(page, limit) {
        try {
            const skip = (page - 1) * limit;
            const posts = await this.postModel
                .find({}, {
                video_url: 1,
                thumbnail: 1,
                caption: 1,
                time: 1,
                numberOfViews: 1,
                numberOfLikes: 1,
                numberOfComments: 1,
                email: 1,
                userName: 1,
                userProfilePicture: 1,
                isLiked: 1,
                Ismock: 1,
            })
                .lean()
                .exec();
            const allVideos = [];
            posts.forEach((post) => {
                post.video_url?.forEach((video, index) => {
                    const content = {
                        id: `content-${post._id}-${index}`,
                        videoUrl: video,
                        thumbnailUrl: post.thumbnail?.[index] || '',
                        caption: post.caption || '',
                        date: post.time
                            ? new Date(post.time).toISOString().split('T')[0]
                            : '',
                        numberOfViews: post.numberOfViews || 0,
                        numberOfLikes: post.numberOfLikes || 0,
                        numberOfComments: post.numberOfComments || 0,
                        userId: post.email,
                        userName: post.userName || 'Unknown',
                        userProfilePicture: post.userProfilePicture || '',
                        isLiked: post.isLiked || false,
                        Ismock: post.Ismock || false,
                    };
                    allVideos.push(content);
                });
            });
            const paginatedVideos = allVideos.slice(skip, skip + limit);
            const isLastPage = skip + limit >= allVideos.length;
            return {
                currentPage: page,
                nextPage: isLastPage ? null : page + 1,
                isLastPage,
                listOfContents: paginatedVideos,
            };
        }
        catch (error) {
            console.error('Error retrieving contents:', error);
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