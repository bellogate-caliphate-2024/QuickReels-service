import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Express } from 'express';
import { Post } from '../Schemas/posts.schema';
import { CreatePostDto } from '../posts.dto';
import { firebaseAdmin, firebaseApp } from '../DataBase/Firebase';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import * as fs from 'fs';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import ffmpeg from 'fluent-ffmpeg';
import * as ffmpegStatic from '@ffmpeg-installer/ffmpeg';
import * as ffprobeStatic from '@ffprobe-installer/ffprobe';

@Injectable()
export class Helper {
  private logger = new Logger(Helper.name);

  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  // async saveToDatabase(postData: Partial<Post>) {
  //   try {
  //     const createdPost = new this.postModel(postData);
  //     return await createdPost.save();
  //   } catch (error) {
  //     this.logger.error(`Database save failed: ${error.message}`, error.stack);
  //     throw this.handleError(error);
  //   }
  // }

  // async handleError(error: any) {
  //   if (error.code === 11000) {
  //     throw new ConflictException('Duplicate video ID detected');
  //   }

  //   if (error.name === 'ValidationError') {
  //     const messages = Object.values(error.errors).map(
  //       (err: any) => err.message,
  //     );
  //     throw new BadRequestException(messages);
  //   }

  //   if (error.name === 'MongoNetworkError') {
  //     throw new InternalServerErrorException('Database connection failed');
  //   }

  //   throw new InternalServerErrorException('Failed to create post');
  // }

  // saveTempFile(buffer: Buffer, filename: string): string {
  //   const filePath = path.join(__dirname, filename);
  //   fs.writeFileSync(filePath, buffer);
  //   return filePath;
  // }

  // async uploadVideoToFirebase(
  //   videoFile: Express.Multer.File,
  //   filePath: string,
  // ): Promise<string> {
  //   const storage = getStorage(firebaseApp);
  //   const fileName = `quickreels_videos/${Date.now()}_${uuidv4()}_${videoFile.originalname}`;

  //   // Upload file
  //   const storageRef = ref(storage, fileName);
  //   await uploadBytesResumable(storageRef, videoFile.buffer, {
  //     contentType: videoFile.mimetype,
  //   });

  //   // Generate download URL
  //   return this.generateFirebaseDownloadUrl(fileName);
  // }

  // async generateThumbnail(videoPath: string, tempDir: string): Promise<string> {
  //   const thumbnailFileName = `thumbnail-${Date.now()}.png`;
  //   const thumbnailPath = path.join(tempDir, thumbnailFileName);

  //   await new Promise((resolve, reject) => {
  //     ffmpeg(videoPath)
  //       .setFfmpegPath(ffmpegStatic.path)
  //       .setFfprobePath(ffprobeStatic.path)
  //       .on('end', resolve)
  //       .on('error', reject)
  //       .screenshots({
  //         timestamps: ['50%'],
  //         filename: thumbnailFileName,
  //         folder: tempDir,
  //         size: '320x240',
  //       });
  //   });

  //   return thumbnailPath;
  // }

  // async uploadThumbnailToFirebase(thumbnailPath: string): Promise<string> {
  //   const storage = getStorage(firebaseApp);
  //   const fileName = `quickreels_thumbnails/${Date.now()}_${uuidv4()}_${path.basename(thumbnailPath)}`;
  //   const buffer = fs.readFileSync(thumbnailPath);

  //   // Upload thumbnail
  //   const storageRef = ref(storage, fileName);
  //   await uploadBytesResumable(storageRef, buffer, {
  //     contentType: 'image/png',
  //   });

  //   // Generate download URL
  //   return this.generateFirebaseDownloadUrl(fileName);
  // }

  // generateFirebaseDownloadUrl(fileName: string): string {
  //   const bucket = firebaseAdmin.storage().bucket();
  //   return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
  // }

  // updateDtoWithUrls(
  //   createDto: CreatePostDto,
  //   videoUrl: string,
  //   thumbnailUrl: string,
  // ): CreatePostDto {
  //   const updatedDto = { ...createDto };

  //   if (!Array.isArray(updatedDto.video_url)) updatedDto.video_url = [];
  //   if (!Array.isArray(updatedDto.thumbnail)) updatedDto.thumbnail = [];

  //   updatedDto.video_url.push(videoUrl);
  //   updatedDto.thumbnail.push(thumbnailUrl);
  //   updatedDto.time = new Date().toISOString();

  //   return updatedDto;
  // }

  // cleanupTempFiles(...paths: string[]) {
  //   paths.forEach((path) => {
  //     if (path && fs.existsSync(path)) {
  //       fs.unlinkSync(path);
  //     }
  //   });
  // }
}
