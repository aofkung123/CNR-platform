import multer from 'multer';
import multerS3 from 'multer-s3';
import { s3, S3_BUCKET } from '../services/gallery.service';
import path from 'path';
import { Request } from 'express';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_MB  = 15;

export const uploadGalleryImage = multer({
  storage: multerS3({
    s3,
    bucket: S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (_req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
      const ext  = path.extname(file.originalname);
      const name = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
      cb(null, name);
    },
    metadata: (_req: Request, file: Express.Multer.File, cb: (error: any, metadata?: any) => void) => {
      cb(null, { fieldName: file.fieldname });
    },
  }),
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  fileFilter: (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (ALLOWED_MIME.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed: ${ALLOWED_MIME.join(', ')}`));
    }
  },
}).single('image');
