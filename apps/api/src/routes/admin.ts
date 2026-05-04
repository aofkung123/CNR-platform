import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { prisma } from '@cnr/database';

const router = Router();

// Rate Limiting: ป้องกันการสุ่มรหัสผ่าน (Brute Force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 นาที
  max: 5, // จำกัด 5 ครั้งต่อ IP
  message: { message: 'เข้าสู่ระบบผิดพลาดเกินกำหนด กรุณาลองใหม่ในอีก 15 นาที' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;

    // 1. หา Admin จาก Email
    const admin = await prisma.admin.findUnique({ where: { email } });
    
    if (!admin || !admin.isActive) {
      if (admin) {
        await prisma.auditLog.create({
          data: { adminId: admin.id, action: 'LOGIN_FAILED_NOT_ACTIVE', ipAddress }
        });
      }
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    // 2. ตรวจสอบรหัสผ่าน
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      await prisma.auditLog.create({
        data: { adminId: admin.id, action: 'LOGIN_FAILED_WRONG_PASSWORD', ipAddress }
      });
      return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    // 3. สร้าง JWT Token
    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // 4. บันทึกประวัติการ Login สำเร็จ และอัปเดตเวลาล่าสุด
    await prisma.$transaction([
      prisma.admin.update({
        where: { id: admin.id },
        data: { lastLogin: new Date() }
      }),
      prisma.auditLog.create({
        data: { adminId: admin.id, action: 'LOGIN_SUCCESS', ipAddress, userAgent: req.headers['user-agent'] }
      })
    ]);

    // 5. ส่ง Token กลับไปใน HTTP-only Cookie
    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: false, // เพื่อให้ทำงานบน localhost (HTTP) ได้แน่นอน
      sameSite: 'lax', // เปลี่ยนจาก strict เป็น lax เพื่อรองรับ Cross-origin เล็กๆ น้อยๆ แบบคนละพอร์ต
      maxAge: 24 * 60 * 60 * 1000, // 1 วัน
      path: '/'
    });

    res.json({ message: 'Login successful', role: admin.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
