import crypto from 'node:crypto';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// ─── S3 Client Singleton ──────────────────────────────────
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-southeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.AWS_S3_BUCKET!;
const PRESIGNED_URL_EXPIRES = 60 * 60; // 1 hour

// ─── Upload a Buffer to S3 ────────────────────────────────
export async function uploadToS3(params: {
  key: string;       // e.g. "documents/audit/2024/invoice.pdf"
  buffer: Buffer;
  mimeType: string;
}): Promise<void> {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: params.key,
      Body: params.buffer,
      ContentType: params.mimeType,
      // Make objects private by default — access via pre-signed URL only
      ACL: 'private',
    })
  );
}

// ─── Delete an Object from S3 ─────────────────────────────
export async function deleteFromS3(key: string): Promise<void> {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}

// ─── Generate a Secure Pre-signed Download URL ────────────
// URL is valid for `expiresIn` seconds (default 1h) and requires no auth header.
export async function generateDownloadUrl(
  key: string,
  expiresIn = PRESIGNED_URL_EXPIRES
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  });
  return getSignedUrl(s3, command, { expiresIn });
}

// ─── Build a canonical S3 Key ─────────────────────────────
// Pattern: {brand}/{category}/{year}/{month}/{uuid}-{filename}
export function buildS3Key(params: {
  brand: string;
  category: string;
  year: number;
  month?: number | null;
  filename: string;
}): string {
  const { brand, category, year, month, filename } = params;
  const sanitized = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const uuid = crypto.randomUUID();
  const monthPart = month ? `/${String(month).padStart(2, '0')}` : '';
  return `${brand}/${category}/${year}${monthPart}/${uuid}-${sanitized}`;
}
