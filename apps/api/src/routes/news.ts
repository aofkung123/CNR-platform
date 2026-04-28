import { Router, Request, Response } from 'express';
import { prisma } from '@cnr/database';

export const newsRouter = Router();

// Helper: safely extract a single string from req.query (avoids `string | string[]` TS errors)
const qs = (val: unknown): string | undefined =>
  typeof val === 'string' ? val : undefined;

// ─── GET /api/news ─────────────────────────────────────────
newsRouter.get('/', async (req: Request, res: Response) => {
  const brand     = qs(req.query.brand);
  const published = qs(req.query.published) ?? 'true';
  const limit     = qs(req.query.limit) ?? '10';

  const articles = await prisma.newsArticle.findMany({
    where: {
      ...(brand ? { brand: brand as any } : {}),
      isPublished: published === 'true',
    },
    orderBy: { publishedAt: 'desc' },
    take: Number(limit),
    select: {
      id: true, title: true, slug: true, excerpt: true,
      coverImage: true, brand: true, publishedAt: true,
    },
  });
  res.json(articles);
});

// ─── GET /api/news/:slug ───────────────────────────────────
newsRouter.get('/:slug', async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const article = await prisma.newsArticle.findUniqueOrThrow({
    where: { slug },
  });
  res.json(article);
});
