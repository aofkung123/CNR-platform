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

import nodemailer from 'nodemailer';

// สร้าง Transporter โดยใช้ Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // อีเมลของคุณ เช่น your-email@gmail.com
    pass: process.env.GMAIL_APP_PASSWORD, // App Password
  },
});

// ─── POST /api/contact ─────────────────────────────────────
contactRouter.post('/', async (req: Request, res: Response) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: 'Validation failed', details: parsed.error.flatten() });
    return;
  }

  try {
    const submission = await prisma.contactSubmission.create({ 
      data: {
        ...parsed.data,
        brand: parsed.data.brand
      }
    });

    const { name, phone, email, subject, message, brand } = parsed.data;

    // 2. จัดเตรียมเนื้อหา Email HTML
    const mailOptions = {
      from: `"${name}" <${process.env.GMAIL_USER}>`, 
      replyTo: email, 
      to: process.env.GMAIL_USER, 
      subject: `[Contact Form - ${brand}] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">มีผู้ติดต่อใหม่จากหน้าเว็บไซต์</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>ชื่อ:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${name}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>อีเมล:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${email}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>เบอร์โทร:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${phone}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>เรื่อง:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${subject}</td></tr>
          </table>
          <div style="margin-top: 20px;">
            <strong>ข้อความ:</strong>
            <p style="background: #f8fafc; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    };

    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
       await transporter.sendMail(mailOptions);
    } else {
       console.warn('GMAIL_USER or GMAIL_APP_PASSWORD not set, skipping email sending.');
    }

    res.status(201).json({ success: true, id: submission.id });
  } catch (error) {
    console.error('Error in contact form:', error);
    res.status(500).json({ error: 'Failed to process contact submission.' });
  }
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
