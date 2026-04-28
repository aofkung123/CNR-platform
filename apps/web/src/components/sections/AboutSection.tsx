import { ArrowRight } from 'lucide-react';
import type { BrandConfig } from '@/config/brands';

export function AboutSection({ brand }: { brand: BrandConfig }) {
  return (
    <section id="history" className="cnr-section">
      <div className="cnr-container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Stats / Visual side */}
          <div className="relative flex justify-center">
            <div
              className="w-64 h-64 md:w-80 md:h-80 rounded-3xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-light) 100%)` }}
            >
              <div className="text-center text-white">
                <div className="text-6xl font-extrabold">10+</div>
                <div className="text-lg font-medium mt-1 opacity-90">ปีประสบการณ์</div>
              </div>
            </div>

            {/* Floating stat card */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-[var(--border)]">
              <div className="text-2xl font-bold" style={{ color: 'var(--brand-primary)' }}>5,000+</div>
              <div className="text-xs text-[var(--muted-foreground)] mt-1">ลูกค้าที่ไว้วางใจ</div>
            </div>
          </div>

          {/* Text side */}
          <div>
            <p className="section-eyebrow">ABOUT US</p>
            <h2 className="section-title mb-4">ประวัติองค์กร</h2>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
              {brand.nameTh} เราคือผู้ให้บริการด้านบัญชีอย่างมืออาชีพ
              โดยบริการของเราประกอบด้วย บริการทำบัญชี ปิดงบการเงิน
              ตรวจสอบบัญชี วางระบบการควบคุมภายใน การวางแผนภาษี
              และให้คำปรึกษาด้านธุรกิจครบวงจร
            </p>
            <p className="text-[var(--muted-foreground)] leading-relaxed mb-8">
              เรามีทีมงานมืออาชีพที่มีความรู้ ความเชี่ยวชาญ
              พร้อมให้บริการแก่ลูกค้าในทุกระดับ
              และมีระบบงานมาตรฐานในการควบคุมคุณภาพ
              เพื่อให้ลูกค้าเกิดความพึงพอใจสูงสุด
            </p>

            <div className="flex gap-8 mb-8">
              <div>
                <div className="text-3xl font-bold" style={{ color: 'var(--brand-primary)' }}>4.9 ⭐</div>
                <div className="text-sm text-[var(--muted-foreground)]">คะแนนเฉลี่ย</div>
              </div>
              <div className="w-px bg-[var(--border)]" />
              <div>
                <div className="text-3xl font-bold" style={{ color: 'var(--brand-primary)' }}>98%</div>
                <div className="text-sm text-[var(--muted-foreground)]">ลูกค้าพึงพอใจ</div>
              </div>
            </div>

            <a href="#contact" className="btn-primary">
              สนใจติดต่อเรา <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
