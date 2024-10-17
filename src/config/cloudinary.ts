import { v2 as cloudinary } from 'cloudinary';
import { config as configurations } from '.';

// Configure Cloudinary
cloudinary.config({
  cloud_name: configurations.cloudinary.cloud_name,
  api_key: configurations.cloudinary.api_key,
  api_secret: configurations.cloudinary.api_secret,
});

export default cloudinary;
