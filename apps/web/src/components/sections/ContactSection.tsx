'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Phone, Mail, MapPin, Send, CheckCircle } from 'lucide-react';
import type { BrandConfig } from '@/config/brands';

const contactSchema = z.object({
  name: z.string().min(2, 'กรุณากรอกชื่อ-นามสกุล'),
  phone: z.string().min(9, 'กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง'),
  email: z.string().email('กรุณากรอกอีเมลที่ถูกต้อง'),
  subject: z.string().min(3, 'กรุณากรอกหัวข้อ'),
  message: z.string().min(10, 'กรุณากรอกรายละเอียด'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactSection({ brand }: { brand: BrandConfig }) {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, brand: brand.key }),
      });
      if (!res.ok) throw new Error('ไม่สามารถส่งข้อความได้');
      setSubmitted(true);
      toast.success('ส่งข้อความสำเร็จ!');
    } catch {
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่');
    }
  };

  return (
    <section id="contact" className="cnr-section cnr-section--bg">
      <div className="cnr-container">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div>
            <p className="section-eyebrow">CONTACT US</p>
            <h2 className="section-title mb-8">ร่วมงานกับเราวันนี้!</h2>

            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                  style={{ background: 'var(--brand-primary)' }}>
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">โทรศัพท์</p>
                  <a href={`tel:${brand.contact.phone}`} className="font-semibold text-[var(--foreground)] hover:text-[var(--brand-primary)]">
                    {brand.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
                  style={{ background: 'var(--brand-primary)' }}>
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">อีเมล</p>
                  <a href={`mailto:${brand.contact.email}`} className="font-semibold text-[var(--foreground)] hover:text-[var(--brand-primary)]">
                    {brand.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white mt-0.5"
                  style={{ background: 'var(--brand-primary)' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">ที่อยู่</p>
                  <p className="font-semibold text-[var(--foreground)] leading-relaxed">{brand.contact.address}</p>
                </div>
              </div>

              {/* Line QR Code */}
              <div className="flex items-start gap-4 mt-2 p-4 rounded-2xl bg-white border border-[var(--border)] shadow-sm">
                <a href="https://line.me/ti/p/~@cnrgroup" target="_blank" rel="noopener noreferrer" 
                   className="w-24 h-24 bg-[var(--muted)] rounded-lg overflow-hidden flex-shrink-0 hover:scale-110 transition-transform">
                  <img 
                    src={brand.lineQrSrc} 
                    alt="Line QR Code" 
                    className="w-full h-full object-cover"
                  />
                </a>
                <div className="flex flex-col justify-center">
                  <p className="text-xs text-[var(--muted-foreground)] font-medium mb-1">LINE OFFICIAL</p>
                  <p className="text-lg font-bold text-[var(--brand-primary)] mb-1">{brand.contact.lineId}</p>
                  <p className="text-[10px] text-[var(--muted-foreground)] leading-tight">
                    สแกน QR Code เพื่อสอบถามข้อมูล<br />หรือปรึกษาเราได้ทันที
                  </p>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <div className="mt-8 rounded-2xl overflow-hidden h-52 border border-[var(--border)]">
              <iframe
                src={brand.mapEmbedUrl}
                title={`${brand.name} Map`}
                className="w-full h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="cnr-card">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle size={56} className="mb-4" style={{ color: 'var(--brand-primary)' }} />
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">ส่งข้อความสำเร็จ!</h3>
                <p className="text-[var(--muted-foreground)]">เราได้รับข้อความของคุณแล้ว<br />จะติดต่อกลับโดยเร็วที่สุด</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-[var(--foreground)] mb-6">ส่งข้อความถึงเรา</h3>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-[var(--foreground)] mb-1.5 block" htmlFor="contact-name">
                        ชื่อ-นามสกุล
                      </label>
                      <input id="contact-name" {...register('name')} placeholder="กรุณากรอกชื่อ-นามสกุล" className="form-input" />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[var(--foreground)] mb-1.5 block" htmlFor="contact-phone">
                        เบอร์โทรศัพท์
                      </label>
                      <input id="contact-phone" {...register('phone')} type="tel" placeholder="กรุณากรอกเบอร์โทร" className="form-input" />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[var(--foreground)] mb-1.5 block" htmlFor="contact-email">อีเมล</label>
                    <input id="contact-email" {...register('email')} type="email" placeholder="กรุณากรอกอีเมล" className="form-input" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[var(--foreground)] mb-1.5 block" htmlFor="contact-subject">หัวข้อ</label>
                    <input id="contact-subject" {...register('subject')} placeholder="กรุณากรอกหัวข้อ" className="form-input" />
                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-[var(--foreground)] mb-1.5 block" htmlFor="contact-message">รายละเอียด</label>
                    <textarea id="contact-message" {...register('message')} rows={4} placeholder="กรุณากรอกรายละเอียด" className="form-input resize-none" />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                  </div>

                  <button type="submit" disabled={isSubmitting} className="btn-primary justify-center mt-2 disabled:opacity-60">
                    {isSubmitting ? 'กำลังส่ง...' : (
                      <><Send size={16} /> ส่งข้อความ</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
