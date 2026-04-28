import { Router, Request, Response } from 'express';
import * as PostService from '../services/post.service';
import { uploadThumbnail } from '../middleware/upload';
import {
  CreatePostSchema,
  UpdatePostSchema,
  PostFiltersSchema,
} from '../types/post.types';

export const postsRouter = Router();

// ─── Helper: wrap multer upload in a promise ──────────────────
function runUpload(req: Request, res: Response): Promise<void> {
  return new Promise((resolve, reject) => {
    uploadThumbnail(req, res, (err) => (err ? reject(err) : resolve()));
  });
}

// ─── Middleware: Async Wrapper ────────────────────────────────
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: any) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error('[API ERROR]:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  });
};

// ─── GET /api/v1/posts ────────────────────────────────────────
postsRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
  const filters = PostFiltersSchema.parse(req.query);
  const result  = await PostService.listPosts(filters);
  res.json(result);
}));

// ─── GET /api/v1/posts/stats ──────────────────────────────────
postsRouter.get('/stats', asyncHandler(async (_req: Request, res: Response) => {
  const stats = await PostService.getNewsSummary();
  res.json(stats);
}));

// ─── GET /api/v1/posts/slug/:slug ─────────────────────────────
postsRouter.get('/slug/:slug', asyncHandler(async (req: Request, res: Response) => {
  const post = await PostService.getPostBySlug(req.params.slug);
  res.json(post);
}));

// ─── GET /api/v1/posts/:id ────────────────────────────────────
postsRouter.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const post = await PostService.getPostById(req.params.id);
  res.json(post);
}));

// ─── POST /api/v1/posts ───────────────────────────────────────
postsRouter.post('/', asyncHandler(async (req: Request, res: Response) => {
  await runUpload(req, res);
  const body = CreatePostSchema.parse(req.body);
  const post  = await PostService.createPost(body, req.file as any);
  res.status(201).json(post);
}));

// ─── PATCH /api/v1/posts/:id ──────────────────────────────────
postsRouter.patch('/:id', asyncHandler(async (req: Request, res: Response) => {
  await runUpload(req, res);
  const body = UpdatePostSchema.parse(req.body);
  const post  = await PostService.updatePost(req.params.id, body, req.file as any);
  res.json(post);
}));

// ─── DELETE /api/v1/posts/:id ─────────────────────────────────
postsRouter.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const result = await PostService.deletePost(req.params.id);
  res.json(result);
}));

// ─── GET /api/v1/stats/news-summary (canonical analytics URL) ─
export const statsRouter = Router();
statsRouter.get('/news-summary', asyncHandler(async (_req: Request, res: Response) => {
  const summary = await PostService.getNewsSummary();
  res.json(summary);
}));
