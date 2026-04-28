import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '@cnr/database';

// ─── Re-use the same S3 client from post.service ─────────────
const region = process.env.AWS_REGION || 'ap-southeast-1';
export const S3_BUCKET = process.env.AWS_S3_BUCKET || '';

export const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
  followRegionRedirects: true,
});

// ─── Delete S3 Object ─────────────────────────────────────────
async function deleteS3Object(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }));
}

// ─── LIST gallery images by site+section ─────────────────────
export async function listGalleryImages(site: string, section: string) {
  return prisma.galleryImage.findMany({
    where: { site: site as any, section: section as any },
    orderBy: { sortOrder: 'asc' },
  });
}

// ─── LIST all gallery images (admin) ─────────────────────────
export async function listAllGalleryImages(site?: string, section?: string) {
  return prisma.galleryImage.findMany({
    where: {
      ...(site    ? { site:    site    as any } : {}),
      ...(section ? { section: section as any } : {}),
    },
    orderBy: [{ site: 'asc' }, { section: 'asc' }, { sortOrder: 'asc' }],
  });
}

// ─── CREATE gallery image ─────────────────────────────────────
export async function createGalleryImage(
  data: { site: string; section: string; caption?: string; sortOrder?: number },
  file: Express.Multer.File,
) {
  const imageUrl = (file as any).location;
  const imageKey = (file as any).key;

  try {
    return await prisma.galleryImage.create({
      data: {
        site:      data.site      as any,
        section:   data.section   as any,
        imageUrl,
        imageKey,
        caption:   data.caption   ?? null,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  } catch (err) {
    if (imageKey) await deleteS3Object(imageKey).catch(() => {});
    throw err;
  }
}

// ─── UPDATE gallery image metadata ───────────────────────────
export async function updateGalleryImage(
  id: string,
  data: { caption?: string; sortOrder?: number },
) {
  return prisma.galleryImage.update({
    where: { id },
    data: {
      ...(data.caption   !== undefined ? { caption:   data.caption   } : {}),
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
    },
  });
}

// ─── DELETE gallery image ─────────────────────────────────────
export async function deleteGalleryImage(id: string) {
  const img = await prisma.galleryImage.findUniqueOrThrow({ where: { id } });
  await prisma.galleryImage.delete({ where: { id } });
  if (img.imageKey) await deleteS3Object(img.imageKey).catch(() => {});
  return { deleted: true };
}

// ─── UPDATE sort orders in bulk ───────────────────────────────
export async function reorderGalleryImages(items: { id: string; sortOrder: number }[]) {
  await Promise.all(
    items.map(({ id, sortOrder }) =>
      prisma.galleryImage.update({ where: { id }, data: { sortOrder } }),
    ),
  );
  return { reordered: true };
}
