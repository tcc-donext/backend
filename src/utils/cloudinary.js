import env from 'dotenv';
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;

env.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
