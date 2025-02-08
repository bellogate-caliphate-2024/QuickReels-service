import {
  Injectable,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Express } from 'express';
import { Post } from '../Schemas/posts.schema';
import { CreatePostDto } from '../posts.dto';
import { Helper } from '../helpers/helper';
import { firebaseAdmin, firebaseApp } from '../DataBase/Firebase';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import * as fs from 'fs';
import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import ffmpeg from 'fluent-ffmpeg';
import * as ffmpegStatic from '@ffmpeg-installer/ffmpeg';
import * as ffprobeStatic from '@ffprobe-installer/ffprobe';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private readonly postModel: Model<Post>,
    private ACTION: Helper,
  ) {}

  async createPost(
    videoFile: Express.Multer.File,
    createDto: CreatePostDto,
  ): Promise<any> {
    try {
      // Step 1: Save the video buffer temporarily
      const videoFileName = `video-${Date.now()}_${uuidv4()}_${videoFile.originalname}`;
      const videoFilePath = path.join(__dirname, videoFileName);

      fs.writeFileSync(videoFilePath, videoFile.buffer);

      // Initialize Firebase Storage
      const storage = getStorage(firebaseApp);
      const videoFileNameInStorage = `quickreels_videos/${Date.now()}_${uuidv4()}_${videoFile.originalname}`;
      const videoStorageRef = ref(storage, videoFileNameInStorage);
      const videoMetadata = { contentType: videoFile.mimetype };
      await uploadBytesResumable(
        videoStorageRef,
        videoFile.buffer,
        videoMetadata,
      );

      const videoToken = uuidv4();
      const bucket = firebaseAdmin.storage().bucket();
      const videoFileRef = bucket.file(videoFileNameInStorage);
      await videoFileRef.setMetadata({
        metadata: { firebaseStorageDownloadTokens: videoToken },
      });

      const videoDownloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(videoFileNameInStorage)}?alt=media&token=${videoToken}`;
      // Step 2: Generate thumbnail using ffmpeg
      const thumbnailFileName = `thumbnail-${Date.now()}.png`;
      const tempDir = path.join(__dirname, 'tmp'); // Temporary directory to save thumbnail
      const thumbnailPath = path.join(tempDir, thumbnailFileName);

      await new Promise((resolve, reject) => {
        ffmpeg(videoFilePath)
          .setFfmpegPath(ffmpegStatic.path) // Set ffmpeg path explicitly
          .setFfprobePath(ffprobeStatic.path) // Set ffprobe path explicitly
          .on('end', resolve)
          .on('error', reject)
          .screenshots({
            timestamps: ['50%'], // Capture from the middle of the video
            filename: thumbnailFileName,
            folder: tempDir, // Save thumbnail in the temp directory
            size: '320x240',
          });
      });

      // Step 3: Upload the thumbnail to Firebase Storage
      const thumbnailFileNameInStorage = `quickreels_thumbnails/${Date.now()}_${uuidv4()}_${thumbnailFileName}`;
      const thumbnailStorageRef = ref(storage, thumbnailFileNameInStorage);
      const thumbnailBuffer = fs.readFileSync(thumbnailPath);
      const thumbnailMetadata = { contentType: 'image/png' };
      await uploadBytesResumable(
        thumbnailStorageRef,
        thumbnailBuffer,
        thumbnailMetadata,
      );

      const thumbnailToken = uuidv4();
      const thumbnailFileRef = bucket.file(thumbnailFileNameInStorage);
      await thumbnailFileRef.setMetadata({
        metadata: { firebaseStorageDownloadTokens: thumbnailToken },
      });

      const thumbnailDownloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(thumbnailFileNameInStorage)}?alt=media&token=${thumbnailToken}`;

      // Clean up temporary files
      fs.unlinkSync(thumbnailPath);
      fs.unlinkSync(videoFilePath);

      // Step 4: Update DTO and save user data
      if (createDto.video_url || !Array.isArray(createDto.video_url)) {
        createDto.video_url = [];
      }
      if (createDto.thumbnail || !Array.isArray(createDto.thumbnail)) {
        createDto.thumbnail = [];
      }
      // Add video URL and thumbnail URL to DTO
      createDto.video_url.push(videoDownloadURL);
      createDto.thumbnail.push(thumbnailDownloadURL);
      createDto.time = new Date().toISOString();

      // Save user data to MongoDB
      const newUser = this.ACTION.saveToDatabase({
        ...createDto,
        userId: uuidv4(),
      });
      await (await newUser).save();

      return {
        message:
          'User video and thumbnail successfully uploaded and stored in Firebase and MongoDB',
        newUser,
      };
    } catch (error) {
      console.error('Error uploading video:', error);
      throw new Error('Failed to upload video');
    }
  }

  async deletePost(email: string, videoUrl: string): Promise<{ message }> {
    try {
      // Find the user by email
      const user = await this.postModel.findOne({ email }).exec();

      if (!user) {
        throw new Error(`user with email ${email} not found`);
      }

      // Remove the specified video URL from the array
      user.videoUrl = user.videoUrl.filter((url) => url !== videoUrl);

      // Save the updated post document
      await user.save();

      return {
        message: `users${user.email} post ${user.videoUrl} succesfully deleted`,
      };
    } catch (error) {
        throw new Error('User with email nonexistent@example.com not found');
    }
  }
}
