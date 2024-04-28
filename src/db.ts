import { Injectable } from '@nestjs/common';
import { MongooseOptionsFactory, MongooseModuleOptions } from '@nestjs/mongoose';

@Injectable()
export class DatabaseConnection implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: "mongodb+srv://Gavin:x$rayG1G@cluster0.su3jrhq.mongodb.net/quickReels_development",
    };
  }
}
