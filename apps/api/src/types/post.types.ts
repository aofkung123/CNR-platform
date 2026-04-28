import { z } from 'zod';

export const CreatePostSchema = z.object({
  title:      z.string().min(3).max(500),
  summary:    z.string().min(10),
  content:    z.string().min(10),
  category:   z.enum(['NEWS', 'INSIGHT', 'EVENT']),
  department: z.enum(['audit', 'accounting', 'advisory']),
  status:     z.enum(['DRAFT', 'PUBLISHED']).optional().default('DRAFT'),
});

export const UpdatePostSchema = CreatePostSchema.partial();

export const PostFiltersSchema = z.object({
  department: z.string().optional(),
  status:     z.string().optional(),
  category:   z.string().optional(),
  page:       z.coerce.number().int().min(1).optional().default(1),
  limit:      z.coerce.number().int().min(1).max(100).optional().default(20),
});

export type CreatePostInput  = z.infer<typeof CreatePostSchema>;
export type UpdatePostInput  = z.infer<typeof UpdatePostSchema>;
export type PostFilters      = z.infer<typeof PostFiltersSchema>;
