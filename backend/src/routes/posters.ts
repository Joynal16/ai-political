import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../middleware/auth';
import { Poster } from '../models/Poster';
import { Template } from '../models/Template';
import { GenerationLog } from '../models/GenerationLog';
import { moderateText } from '../utils/moderation';
import { suggestLayout } from '../services/gemini';
import { renderPoster } from '../services/render';

const router = Router();
const generationLimit = rateLimit({ windowMs: 60_000, limit: 5, standardHeaders: true, legacyHeaders: false });

async function publicFile(temp: string, prefix: string) {
  const name = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${path.extname(temp)}`;
  const target = path.resolve(process.cwd(), 'uploads', name);
  await fs.copyFile(temp, target);
  return `/uploads/${name}`;
}

router.post('/', requireAuth, generationLimit, async (req, res) => {
  const started = Date.now();
  let poster: any;
  try {
    const { templateId, formData, photoUrls = [] } = req.body;
    const template = await Template.findById(templateId);
    if (!template) return res.status(404).json({ message: 'Template not found.' });
    const data = formData || {};
    const moderation = moderateText([data.headline, data.name, data.designation, data.organization, data.party, data.occasion]);
    poster = await Poster.create({ userId: req.user!.id, templateId, formData: data, uploadedPhotoUrls: photoUrls, status: moderation.flagged ? 'flagged' : 'generating', moderation });
    if (moderation.flagged) return res.status(422).json({ message: 'Content requires review before rendering.', reasons: moderation.reasons, posterId: poster._id });

    const { suggestion, prompt } = await suggestLayout({
      occasion: String(data.occasion || template.occasionType),
      headline: String(data.headline || ''),
      photoCount: photoUrls.length,
      templateTitle: template.title
    });
    const output = await renderPoster({ template, formData: data, photoUrls, layout: suggestion });
    const imageUrl = await publicFile(output.pngPath, 'poster');
    const pdfUrl = await publicFile(output.pdfPath, 'poster');
    poster.status = 'completed';
    poster.generatedImageUrl = imageUrl;
    poster.generatedPdfUrl = pdfUrl;
    poster.aiLayout = suggestion;
    await poster.save();
    await GenerationLog.create({ posterId: poster._id, geminiPromptUsed: prompt, latencyMs: Date.now() - started, success: true });
    return res.status(201).json(poster);
  } catch (error) {
    if (poster) { poster.status = 'failed'; await poster.save(); await GenerationLog.create({ posterId: poster._id, geminiPromptUsed: 'generation-error', latencyMs: Date.now() - started, success: false }); }
    return res.status(500).json({ message: 'Poster generation failed.', detail: process.env.NODE_ENV === 'development' ? String(error) : undefined });
  }
});

router.get('/user/:userId', requireAuth, async (req, res) => {
  if (req.user!.id !== req.params.userId && req.user!.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  res.json(await Poster.find({ userId: req.params.userId }).populate('templateId').sort({ createdAt: -1 }));
});

router.get('/:id', requireAuth, async (req, res) => {
  const poster = await Poster.findOne({ _id: req.params.id, userId: req.user!.id }).populate('templateId');
  if (!poster) return res.status(404).json({ message: 'Poster not found.' });
  res.json(poster);
});

router.post('/:id/regenerate', requireAuth, generationLimit, async (req, res) => {
  const existing = await Poster.findOne({ _id: req.params.id, userId: req.user!.id }).populate('templateId');
  if (!existing) return res.status(404).json({ message: 'Poster not found.' });
  const template = existing.templateId as any;
  const { suggestion, prompt } = await suggestLayout({ occasion: String(existing.formData.occasion || template.occasionType), headline: String(existing.formData.headline || ''), photoCount: existing.uploadedPhotoUrls.length, templateTitle: template.title });
  const output = await renderPoster({ template, formData: existing.formData, photoUrls: existing.uploadedPhotoUrls, layout: suggestion });
  existing.generatedImageUrl = await publicFile(output.pngPath, 'poster');
  existing.generatedPdfUrl = await publicFile(output.pdfPath, 'poster');
  existing.aiLayout = suggestion;
  existing.status = 'completed';
  await existing.save();
  await GenerationLog.create({ posterId: existing._id, geminiPromptUsed: prompt, latencyMs: 0, success: true });
  res.json(existing);
});

router.delete('/:id', requireAuth, async (req, res) => {
  await Poster.deleteOne({ _id: req.params.id, userId: req.user!.id });
  res.status(204).send();
});

export default router;
