import { Router } from 'express';
import { requireAdmin, requireAuth } from '../middleware/auth';
import { Poster } from '../models/Poster';

const router = Router();
router.get('/posters', requireAuth, requireAdmin, async (_req, res) => {
  res.json(await Poster.find({ status: 'flagged' }).populate('userId templateId').sort({ createdAt: -1 }));
});
export default router;
