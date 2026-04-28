import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '@cnr/database';

export const contactRouter = Router();

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(9).max(20),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
  brand: z.enum(['cac_audit', 'nr_accounting', 'nr_advisory', 'model_mix', 'cnr_group']),
});

// ─── POST /api/contact ─────────────────────────────────────
contactRouter.post('/', async (req: Request, res: Response) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: 'Validation failed', details: parsed.error.flatten() });
    return;
  }

  const submission = await prisma.contactSubmission.create({ 
    data: {
      ...parsed.data,
      brand: parsed.data.brand
    }
  });
  res.status(201).json({ success: true, id: submission.id });
});

// Helper: safely extract a single string from req.query
const qs = (val: unknown): string | undefined =>
  typeof val === 'string' ? val : undefined;

// ─── GET /api/contact — List Submissions (admin) ───────────
contactRouter.get('/', async (req: Request, res: Response) => {
  const brand  = qs(req.query.brand);
  const isRead = qs(req.query.isRead);
  const submissions = await prisma.contactSubmission.findMany({
    where: {
      ...(brand  ? { brand: brand as any } : {}),
      ...(isRead !== undefined ? { isRead: isRead === 'true' } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  res.json(submissions);
});
