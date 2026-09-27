import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { requireAuth } from '../middleware/auth';
import { saveUpload } from '../services/storage';

const router = Router();
const upload = multer({
  dest: path.resolve(process.cwd(), 'uploads'),
  limits: { fileSize: 8 * 1024 * 1024, files: 3 },
  fileFilter: (_req, file, cb) => cb(null, /^image\/(jpeg|png|webp)$/.test(file.mimetype))
});

router.post('/', requireAuth, upload.array('photos', 3), async (req, res) => {
  try {
    const files = (req.files as Express.Multer.File[]) || [];
    const urls = await Promise.all(files.map(saveUpload));
    res.json({ urls });
  } catch { res.status(500).json({ message: 'Upload failed.' }); }
});
export default router;
