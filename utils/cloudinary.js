import cloudinary from "cloudinary";
import { config } from "dotenv";

config(); // Load environment variables

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

export default cloudinary.v2;
