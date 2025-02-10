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
const path_1 = require("path");
let PostsService = class PostsService {
    constructor(postModel, ACTION) {
        this.postModel = postModel;
        this.ACTION = ACTION;
    }
    async createPost(videoFile, createDto) {
        const tempDir = path_1.default.join(__dirname, 'tmp');
        let videoFilePath;
        let thumbnailPath;
        try {
            videoFilePath = this.ACTION.saveTempFile(videoFile.buffer, `video-${Date.now()}_${(0, uuid_1.v4)()}_${videoFile.originalname}`);
            const videoUrl = await this.ACTION.uploadVideoToFirebase(videoFile, videoFilePath);
            thumbnailPath = await this.ACTION.generateThumbnail(videoFilePath, tempDir);
            const thumbnailUrl = await this.ACTION.uploadThumbnailToFirebase(thumbnailPath);
            const updatedDto = this.ACTION.updateDtoWithUrls(createDto, videoUrl, thumbnailUrl);
            const newUser = await this.ACTION.saveToDatabase(updatedDto);
            return {
                message: 'User video and thumbnail successfully uploaded and stored in Firebase and MongoDB',
                newUser,
            };
        }
        catch (error) {
            console.error('Error uploading video:', error);
            throw new Error('Failed to upload video');
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