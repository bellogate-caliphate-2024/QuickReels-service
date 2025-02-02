import { config } from 'dotenv';
import { MongoClient, Db } from 'mongodb';

export class Database {
  private DatabaseSecrets = {
    QuickreelsMongodbURL: process.env.MONGO_URI,
    QuickReels_Development_URI: process.env.Developemnt,
    QuickReels_Production_URI: process.env.Production,
    QuickReels_Development_PORT: process.env.Development_PORT,
    QuickReels_Production_PORT: process.env.Production_PORT,
    QuickReels_Development_DB: process.env.Development_DB,
    QuickReels_Production_DB: process.env.Production_DB,
  };
}
