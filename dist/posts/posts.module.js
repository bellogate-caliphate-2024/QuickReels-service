"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsModule = void 0;
const common_1 = require("@nestjs/common");
const posts_controller_1 = require("./controllers/posts.controller");
const posts_service_1 = require("./services/posts.service");
const mongoose_1 = require("@nestjs/mongoose");
const posts_schema_1 = require("./models/posts.schema");
const helper_module_1 = require("../helpers/helper.module");
const aws_module_1 = require("../DataBase/aws.module");
const likes_schema_1 = require("../likes/models/likes.schema");
const posts_repository_1 = require("./repository/posts.repository");
let PostsModule = class PostsModule {
};
exports.PostsModule = PostsModule;
exports.PostsModule = PostsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: posts_schema_1.Post.name, schema: posts_schema_1.PostSchema },
                { name: likes_schema_1.Like.name, schema: likes_schema_1.LikeSchema },
            ]),
        ],
        controllers: [posts_controller_1.PostsController],
        providers: [posts_service_1.PostsService, helper_module_1.DatabaseHelper, aws_module_1.AwsS3Service, posts_repository_1.PostsRepository],
    })
], PostsModule);
//# sourceMappingURL=posts.module.js.map