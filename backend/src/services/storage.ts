import fs from 'fs/promises';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

export async function initStorage() {
  if (process.env.STORAGE_PROVIDER === 'cloudinary') {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  } else {
    await fs.mkdir(path.resolve(process.cwd(), 'uploads'), { recursive: true });
  }
}

export async function saveUpload(file: Express.Multer.File): Promise<string> {
  if (process.env.STORAGE_PROVIDER === 'cloudinary') {
    const result = await cloudinary.uploader.upload(file.path, { folder: 'ai-political-posters' });
    return result.secure_url;
  }
  return `/uploads/${path.basename(file.path)}`;
}
