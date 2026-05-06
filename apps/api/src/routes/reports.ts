import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '@cnr/database';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import multerS3 from 'multer-s3';
import { s3, S3_BUCKET } from '../services/gallery.service';
import { generateDownloadUrl } from '../services/s3.service';

export const reportRouter = Router();

// ─── reCAPTCHA v3 Verify ───────────────────────────────────
async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    console.warn('RECAPTCHA_SECRET_KEY not set — skipping verification');
    return true;
  }

  if (token === 'dev-bypass') {
    console.warn('reCAPTCHA dev-bypass token — skipping verification');
    return true;
  }

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&response=${token}`,
    });
    const data = (await res.json()) as { success: boolean; score?: number };
    return data.success;
  } catch {
    return false;
  }
}

// ─── File Upload — S3 ──────────────────────────────────────
const ALLOWED_MIME = [
  'image/png',
  'image/jpeg',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const upload = multer({
  storage: multerS3({
    s3,
    bucket: S3_BUCKET,
    contentType: (_req, file, cb) => cb(null, file.mimetype),
    key: (_req: Request, file: Express.Multer.File, cb: (error: any, key?: string) => void) => {
      const ext  = path.extname(file.originalname);
      const uuid = crypto.randomUUID();
      const key  = `reports/${Date.now()}-${uuid}${ext}`;
      cb(null, key);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`ไม่รองรับประเภทไฟล์ ${file.mimetype}`));
  },
});

// ─── Validation Schema ────────────────────────────────────
const reportSchema = z.object({
  name:           z.string().min(2).max(100),
  phone:          z.string().min(9).max(20),
  email:          z.string().email(),
  category:       z.enum(['technical', 'usage', 'suggestion', 'billing', 'other']),
  message:        z.string().min(10).max(5000),
  brand:          z.enum(['cac_audit', 'nr_accounting', 'nr_advisory', 'model_mix', 'cnr_group']),
  recaptchaToken: z.string().min(1),
});

// ─── POST /api/v1/reports — Submit report ─────────────────
reportRouter.post(
  '/',
  upload.array('attachments', 5),
  async (req: Request, res: Response) => {
    const parsed = reportSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(422).json({ error: 'Validation failed', details: parsed.error.flatten() });
      return;
    }

    const captchaOk = await verifyRecaptcha(parsed.data.recaptchaToken);
    if (!captchaOk) {
      res.status(403).json({ error: 'reCAPTCHA verification failed. Please try again.' });
      return;
    }

    const files = (req.files as Express.Multer.File[]) ?? [];
    // Store S3 keys as the attachments list
    const attachments = files.map((f) => (f as any).key);

    const report = await prisma.reportSubmission.create({
      data: {
        name:        parsed.data.name,
        phone:       parsed.data.phone,
        email:       parsed.data.email,
        category:    parsed.data.category,
        message:     parsed.data.message,
        brand:       parsed.data.brand,
        attachments: attachments.length ? JSON.stringify(attachments) : null,
      },
    });

    res.status(201).json({ success: true, id: report.id });
  },
);

// ─── Helper ───────────────────────────────────────────────
const qs = (val: unknown): string | undefined =>
  typeof val === 'string' ? val : undefined;

// ─── GET /api/v1/reports — List reports (admin) ────────────
reportRouter.get('/', async (req: Request, res: Response) => {
  const brand    = qs(req.query.brand);
  const category = qs(req.query.category);
  const isRead   = qs(req.query.isRead);
  const page     = Math.max(1, Number(req.query.page) || 1);
  const limit    = Math.min(50, Number(req.query.limit) || 20);

  const where = {
    ...(brand    ? { brand:    brand    as any } : {}),
    ...(category ? { category: category as any } : {}),
    ...(isRead !== undefined ? { isRead: isRead === 'true' } : {}),
  };

  const [total, reports] = await prisma.$transaction([
    prisma.reportSubmission.count({ where }),
    prisma.reportSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  res.json({ total, page, limit, reports });
});

// ─── GET /api/v1/reports/attachments — Get pre-signed URLs ──
reportRouter.get('/attachments', async (req: Request, res: Response) => {
  const { keys } = req.query as { keys?: string };
  if (!keys) {
    res.json({});
    return;
  }

  const keyList: string[] = JSON.parse(keys);
  const urls: Record<string, string> = {};

  await Promise.all(
    keyList.map(async (key) => {
      try {
        urls[key] = await generateDownloadUrl(key, 3600); // 1 hour
      } catch {
        urls[key] = '';
      }
    }),
  );

  res.json(urls);
});

// ─── PATCH /api/v1/reports/:id/read — Mark as read ────────
reportRouter.patch('/:id/read', async (req: Request, res: Response) => {
  const { id } = req.params;
  const report = await prisma.reportSubmission.update({
    where: { id },
    data:  { isRead: true },
  });
  res.json(report);
});
