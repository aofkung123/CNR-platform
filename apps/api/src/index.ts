import 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { documentRouter } from './routes/documents';
import { contactRouter } from './routes/contact';
import { newsRouter } from './routes/news';
import { postsRouter, statsRouter } from './routes/posts';
import { galleryRouter } from './routes/gallery';
import adminRouter from './routes/admin';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// ─── Middleware ────────────────────────────────────────────
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Health Check ──────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ───────────────────────────────────────────────
app.use('/api/documents', documentRouter);
app.use('/api/contact', contactRouter);
app.use('/api/news', newsRouter);
// v1 versioned routes
app.use('/api/v1/posts', postsRouter);
app.use('/api/v1/stats', statsRouter);
app.use('/api/v1/gallery', galleryRouter);
app.use('/api/v1/admin', adminRouter);

// ─── 404 ──────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// ─── Error Handler ────────────────────────────────────────
app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CNR API running on http://0.0.0.0:${PORT}`);
});

export default app;
