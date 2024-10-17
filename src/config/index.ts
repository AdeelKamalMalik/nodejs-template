import * as dotenv from 'dotenv';
import * as path from 'path';

const ENV = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production' ? 'production' : 'development';

const envFileName = ENV === 'production' ? '.env.prod' : '.env.local';
const envPath = path.resolve(__dirname, `../../environments/${envFileName}`);

dotenv.config({ path: envPath });

export const config = {
  environment: ENV,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_DATABASE || 'backend_dev',
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
  },
};
