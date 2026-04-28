import { Router, Request, Response } from 'express';
import * as GalleryService from '../services/gallery.service';
import { uploadGalleryImage } from '../middleware/uploadGallery';
import { z } from 'zod';

export const galleryRouter = Router();

// ─── Helper: wrap multer upload in a promise ──────────────────
function runUpload(req: Request, res: Response): Promise<void> {
  return new Promise((resolve, reject) => {
    uploadGalleryImage(req, res, (err) => (err ? reject(err) : resolve()));
  });
}

// ─── Middleware: Async Wrapper ────────────────────────────────
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: any) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error('[GALLERY API ERROR]:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  });
};

// ─── Validation schemas ───────────────────────────────────────
const VALID_SITES    = ['cnr_group', 'cac_audit', 'nr_advisory', 'nr_accounting', 'model_mix'] as const;
const VALID_SECTIONS = ['TESTIMONIALS', 'AWARDS', 'INDUSTRIES', 'CERTIFICATIONS'] as const;

const CreateGallerySchema = z.object({
  site:      z.enum(VALID_SITES),
  section:   z.enum(VALID_SECTIONS),
  caption:   z.string().max(500).optional(),
  sortOrder: z.coerce.number().int().min(0).optional().default(0),
});

const UpdateGallerySchema = z.object({
  caption:   z.string().max(500).optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
});

const ReorderSchema = z.object({
  items: z.array(z.object({ id: z.string(), sortOrder: z.number().int() })),
});

const QuerySchema = z.object({
  site:    z.enum(VALID_SITES).optional(),
  section: z.enum(VALID_SECTIONS).optional(),
});

// ─── GET /api/v1/gallery ─────────────────────────────────────
galleryRouter.get('/', asyncHandler(async (req: Request, res: Response) => {
  const query = QuerySchema.parse(req.query);
  const images = await GalleryService.listAllGalleryImages(query.site, query.section);
  res.json(images);
}));

// ─── GET /api/v1/gallery/public?site=&section= ───────────────
galleryRouter.get('/public', asyncHandler(async (req: Request, res: Response) => {
  const { site, section } = req.query as { site: string; section: string };
  if (!site || !section) {
    return res.status(400).json({ error: 'site and section are required' });
  }
  const images = await GalleryService.listGalleryImages(site, section);
  res.json(images);
}));

// ─── POST /api/v1/gallery ────────────────────────────────────
galleryRouter.post('/', asyncHandler(async (req: Request, res: Response) => {
  await runUpload(req, res);
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }
  const data = CreateGallerySchema.parse(req.body);
  const image = await GalleryService.createGalleryImage(data, req.file as any);
  res.status(201).json(image);
}));

// ─── PATCH /api/v1/gallery/:id ───────────────────────────────
galleryRouter.patch('/:id', asyncHandler(async (req: Request, res: Response) => {
  const data = UpdateGallerySchema.parse(req.body);
  const image = await GalleryService.updateGalleryImage(req.params.id, data);
  res.json(image);
}));

// ─── POST /api/v1/gallery/reorder ────────────────────────────
galleryRouter.post('/reorder', asyncHandler(async (req: Request, res: Response) => {
  const { items } = ReorderSchema.parse(req.body);
  await GalleryService.reorderGalleryImages(items);
  res.json({ reordered: true });
}));

// ─── DELETE /api/v1/gallery/:id ──────────────────────────────
galleryRouter.delete('/:id', asyncHandler(async (req: Request, res: Response) => {
  const result = await GalleryService.deleteGalleryImage(req.params.id);
  res.json(result);
}));
