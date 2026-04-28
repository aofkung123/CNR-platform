export { PrismaClient } from '@prisma/client';
export type {
  Document,
  ContactSubmission,
  NewsArticle,
  Post,
} from '@prisma/client';

export {
  DocumentCategory,
  CompanyBrand,
  PostCategory,
  PostDepartment,
  PostStatus,
} from '@prisma/client';

// Singleton Prisma Client (prevents multiple connections in dev)
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
