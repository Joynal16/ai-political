import { Router } from 'express';
import { Template } from '../models/Template';
import { requireAdmin, requireAuth } from '../middleware/auth';

const router = Router();
router.get('/', async (req, res) => {
  const filter = req.query.occasion ? { occasionType: req.query.occasion, isActive: true } : { isActive: true };
  const templates = await Template.find(filter).sort({ createdAt: -1 });
  res.json(templates);
});
router.get('/:id', async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) return res.status(404).json({ message: 'Template not found' });
  res.json(template);
});
router.post('/', requireAuth, requireAdmin, async (req, res) => res.status(201).json(await Template.create(req.body)));
router.patch('/:id', requireAuth, requireAdmin, async (req, res) => res.json(await Template.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => { await Template.findByIdAndDelete(req.params.id); res.status(204).send(); });
export default router;
