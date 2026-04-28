import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '@cnr/database';
import { PostCategory, PostDepartment, PostStatus } from '@cnr/database';
import { CreatePostInput, UpdatePostInput, PostFilters } from '../types/post.types';

// ─── S3 Client ────────────────────────────────────────────────
const region = process.env.AWS_REGION || 'ap-southeast-1';
export const S3_BUCKET = process.env.AWS_S3_BUCKET || '';

console.log(`[S3] Initializing with:
  - Region: ${region}
  - Bucket: ${S3_BUCKET}
  - Key ID: ${process.env.AWS_ACCESS_KEY_ID ? 'PRESENT' : 'MISSING'}
`);

export const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId:     process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
  // เพิ่มการตั้งค่าเพื่อรองรับการ Redirect Region อัตโนมัติในบางกรณี
  followRegionRedirects: true,
});

// ─── Slug Generator ───────────────────────────────────────────
export function generateSlug(title: string): string {
  const timestamp = Date.now();
  const base = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 80);
  return `${base}-${timestamp}`;
}

// ─── Delete S3 Object (used for rollback) ─────────────────────
async function deleteS3Object(key: string): Promise<void> {
  await s3.send(new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: key }));
}

// ─── LIST Posts ───────────────────────────────────────────────
export async function listPosts(filters: PostFilters) {
  const { department, status, category, page = 1, limit = 20 } = filters;
  const skip = (page - 1) * limit;

  const where = {
    ...(department ? { department: department as PostDepartment } : {}),
    ...(status     ? { status: status as PostStatus }            : {}),
    ...(category   ? { category: category as PostCategory }      : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true, title: true, slug: true, summary: true,
        thumbnailUrl: true, category: true, department: true,
        status: true, viewCount: true, publishedAt: true, createdAt: true,
      },
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, page, limit, totalPages: Math.ceil(total / limit) };
}

// ─── GET Post by Slug ─────────────────────────────────────────
export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findUniqueOrThrow({ where: { slug } });

  // Increment viewCount atomically
  await prisma.post.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  return post;
}

// ─── GET Post by ID (admin) ───────────────────────────────────
export async function getPostById(id: string) {
  return prisma.post.findUniqueOrThrow({ where: { id } });
}

// ─── CREATE Post ─────────────────────────────────────────────
export async function createPost(
  data: CreatePostInput,
  file?: Express.Multer.File,
) {
  const slug         = generateSlug(data.title);
  const thumbnailUrl = file ? (file as any).location : undefined;
  const thumbnailKey = file ? (file as any).key       : undefined;

  try {
    const post = await prisma.post.create({
      data: {
        title:        data.title,
        slug,
        summary:      data.summary,
        content:      data.content,
        category:     data.category as PostCategory,
        department:   data.department as PostDepartment,
        status:       (data.status as PostStatus) ?? PostStatus.DRAFT,
        thumbnailUrl,
        thumbnailKey,
        publishedAt:  data.status === PostStatus.PUBLISHED ? new Date() : null,
      },
    });
    return post;
  } catch (err) {
    // Rollback: delete uploaded S3 file if DB insert fails
    if (thumbnailKey) {
      await deleteS3Object(thumbnailKey).catch(() => {});
    }
    throw err;
  }
}

// ─── UPDATE Post ─────────────────────────────────────────────
export async function updatePost(
  id: string,
  data: UpdatePostInput,
  file?: Express.Multer.File,
) {
  const existing = await prisma.post.findUniqueOrThrow({ where: { id } });

  const thumbnailUrl = file ? (file as any).location : existing.thumbnailUrl;
  const thumbnailKey = file ? (file as any).key       : existing.thumbnailKey;

  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(data.title   ? { title: data.title, slug: generateSlug(data.title) } : {}),
        ...(data.summary ? { summary: data.summary } : {}),
        ...(data.content ? { content: data.content } : {}),
        ...(data.category   ? { category: data.category as PostCategory }     : {}),
        ...(data.department ? { department: data.department as PostDepartment } : {}),
        ...(data.status ? {
          status: data.status as PostStatus,
          publishedAt:
            data.status === PostStatus.PUBLISHED && !existing.publishedAt
              ? new Date()
              : existing.publishedAt,
        } : {}),
        thumbnailUrl,
        thumbnailKey,
      },
    });

    // Delete old S3 thumbnail only after successful DB update
    if (file && existing.thumbnailKey) {
      await deleteS3Object(existing.thumbnailKey).catch(() => {});
    }

    return post;
  } catch (err) {
    // Rollback: delete newly uploaded S3 file if DB update fails
    if (file && thumbnailKey) {
      await deleteS3Object(thumbnailKey).catch(() => {});
    }
    throw err;
  }
}

// ─── DELETE Post ─────────────────────────────────────────────
export async function deletePost(id: string) {
  const post = await prisma.post.findUniqueOrThrow({ where: { id } });

  await prisma.post.delete({ where: { id } });

  // Remove S3 thumbnail after successful DB delete
  if (post.thumbnailKey) {
    await deleteS3Object(post.thumbnailKey).catch(() => {});
  }

  return { deleted: true };
}

// ─── ANALYTICS: News Summary ──────────────────────────────────
export async function getNewsSummary() {
  const [
    totalByDepartment,
    topTrending,
    statusSummary,
    monthlyPublished,
  ] = await Promise.all([

    // 1. ยอดวิวรวมแยกตามแผนก
    prisma.post.groupBy({
      by: ['department'],
      _sum:   { viewCount: true },
      _count: { id: true },
    }),

    // 2. Top 5 Trending (viewCount สูงสุด)
    prisma.post.findMany({
      where:   { status: PostStatus.PUBLISHED },
      orderBy: { viewCount: 'desc' },
      take:    5,
      select:  {
        id: true, title: true, slug: true,
        department: true, category: true,
        viewCount: true, publishedAt: true,
      },
    }),

    // 3. สรุปสถานะ Draft vs Published
    prisma.post.groupBy({
      by:    ['status'],
      _count: { id: true },
    }),

    // 4. ยอด Publish รายเดือน (12 เดือนล่าสุด)
    prisma.$queryRaw<Array<{ month: string; count: bigint }>>`
      SELECT DATE_FORMAT(publishedAt, '%Y-%m') AS \`month\`, COUNT(*) AS count
      FROM posts
      WHERE status = 'PUBLISHED'
        AND publishedAt >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
      GROUP BY \`month\`
      ORDER BY \`month\` ASC
    `,
  ]);

  return {
    departmentActivity: totalByDepartment.map((d) => ({
      department: d.department,
      totalViews: d._sum.viewCount ?? 0,
      totalPosts: d._count.id,
    })),
    topTrending,
    statusSummary: statusSummary.map((s) => ({
      status: s.status,
      count:  s._count.id,
    })),
    monthlyPublished: monthlyPublished.map((r) => ({
      month: r.month,
      count: Number(r.count),
    })),
  };
}
