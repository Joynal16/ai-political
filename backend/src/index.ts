import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { connectDb } from './config/db';
import { initStorage } from './services/storage';
import authRoutes from './routes/auth';
import templateRoutes from './routes/templates';
import posterRoutes from './routes/posters';
import uploadRoutes from './routes/upload';
import adminRoutes from './routes/admin';

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL?.split(',') || true }));
app.use(express.json({ limit: '2mb' }));
app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'poster-maker-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/posters', posterRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);

const port = Number(process.env.PORT || 5000);
connectDb(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai-political-poster-maker')
  .then(initStorage)
  .then(() => app.listen(port, () => console.log(`API listening on http://localhost:${port}`)))
  .catch((error) => { console.error('Startup failed', error); process.exit(1); });
