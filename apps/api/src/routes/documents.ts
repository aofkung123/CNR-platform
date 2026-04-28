import { Router, Request, Response } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { prisma } from '@cnr/database';
import { uploadToS3, deleteFromS3, generateDownloadUrl, buildS3Key } from '../services/s3.service';

// Helper: safely extract a single string from req.query (avoids `string | string[]` TS errors)
const qs = (val: unknown): string | undefined =>
  typeof val === 'string' ? val : undefined;

export const documentRouter = Router();

// multer — store file in memory, then stream to S3
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    cb(null, allowed.includes(file.mimetype));
  },
});

// ─── Zod validation schemas ────────────────────────────────
const uploadSchema = z.object({
  category: z.enum(['audit', 'accounting', 'advisory', 'modelmix', 'cnrgroup']),
  brand: z.enum(['cac_audit', 'nr_accounting', 'nr_advisory', 'model_mix', 'cnr_group']),
  year: z.coerce.number().int().min(2000).max(2100),
  month: z.coerce.number().int().min(1).max(12).optional(),
  tags: z.string().optional(),
});

// ─── POST /api/documents — Upload Document ─────────────────
// CRITICAL: Transactional upload — if DB save fails, S3 file is deleted (rollback)
documentRouter.post('/', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }

  const parsed = uploadSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: 'Validation failed', details: parsed.error.flatten() });
    return;
  }

  const { category, brand, year, month, tags } = parsed.data;
  const s3Key = buildS3Key({ brand, category, year, month, filename: req.file.originalname });

  // Step 1: Upload to S3
  await uploadToS3({
    key: s3Key,
    buffer: req.file.buffer,
    mimeType: req.file.mimetype,
  });

  // Step 2: Save metadata to DB — if this fails, rollback S3
  try {
    const doc = await prisma.document.create({
      data: {
        filename: req.file.originalname,
        category,
        s3Key,
        mimeType: req.file.mimetype,
        fileSize: req.file.size,
        year,
        month: month ?? null,
        brand,
        tags: tags ?? null,
      },
    });
    res.status(201).json({ success: true, document: doc });
  } catch (dbError) {
    // ─── ROLLBACK: Delete S3 object if DB insert fails ───
    console.error('[Upload] DB save failed — rolling back S3 upload:', dbError);
    await deleteFromS3(s3Key).catch((s3Err) =>
      console.error('[Upload] S3 rollback failed — manual cleanup required for key:', s3Key, s3Err)
    );
    throw dbError; // Re-throw so errorHandler returns 500
  }
});

// ─── GET /api/documents — List Documents ──────────────────
documentRouter.get('/', async (req: Request, res: Response) => {
  const category = qs(req.query.category);
  const brand    = qs(req.query.brand);
  const year     = qs(req.query.year);
  const month    = qs(req.query.month);
  const page     = qs(req.query.page)  ?? '1';
  const limit    = qs(req.query.limit) ?? '20';

  const where = {
    ...(category ? { category: category as any } : {}),
    ...(brand    ? { brand:    brand    as any } : {}),
    ...(year     ? { year:     Number(year)     } : {}),
    ...(month    ? { month:    Number(month)    } : {}),
  };

  const [total, documents] = await prisma.$transaction([
    prisma.document.count({ where }),
    prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    }),
  ]);

  res.json({ total, page: Number(page), limit: Number(limit), documents });
});

// ─── GET /api/documents/:id/download — Pre-signed URL ─────
documentRouter.get('/:id/download', async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const doc = await prisma.document.findUniqueOrThrow({ where: { id } });
  const url = await generateDownloadUrl(doc.s3Key);
  res.json({ url, expiresIn: 3600 });
});

// ─── DELETE /api/documents/:id ─────────────────────────────
documentRouter.delete('/:id', async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const doc = await prisma.document.findUniqueOrThrow({ where: { id } });

  // Delete from S3 first, then DB
  await deleteFromS3(doc.s3Key);
  await prisma.document.delete({ where: { id: doc.id } });

  res.json({ success: true, message: 'Document deleted' });
});
