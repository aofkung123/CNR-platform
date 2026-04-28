import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Error]', err);

  // Prisma "Not Found" error
  if (err && typeof err === 'object' && 'code' in err) {
    const prismaErr = err as { code: string; message: string };
    if (prismaErr.code === 'P2025') {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }
  }

  const message = err instanceof Error ? err.message : 'Internal server error';
  res.status(500).json({ error: message });
}
