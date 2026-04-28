import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { BRANDS, type BrandConfig } from '@/config/brands';

interface ServicesSectionProps {
  brand: BrandConfig;
  showAllCompanies?: boolean; // used on CNR Group home to show all subsidiaries
}

// Services listed per brand
const BRAND_SERVICES: Record<string, { icon: string; title: string; desc: string }[]> = {
  cac_audit: [
    { icon: '🔍', title: 'ตรวจสอบงบการเงิน', desc: 'ตรวจสอบโดยผู้สอบบัญชีรับอนุญาต (CPA) มาตรฐาน TSAS' },
    { icon: '📋', title: 'ตรวจสอบภายใน', desc: 'วางระบบการควบคุมภายในให้มีประสิทธิภาพ' },
    { icon: '⚖️', title: 'ตรวจสอบพิเศษ', desc: 'ตรวจสอบกรณีพิเศษตามที่ผู้ถือหุ้นร้องขอ' },
  ],
  nr_accounting: [
    { icon: '📊', title: 'ทำบัญชีรายเดือน', desc: 'จัดทำบัญชีและรายงานทางการเงินรายเดือน' },
    { icon: '📑', title: 'ปิดงบการเงินประจำปี', desc: 'จัดทำงบการเงินสำหรับยื่นสรรพากร' },
    { icon: '🧾', title: 'วางแผนภาษี', desc: 'วางแผนภาษีเพื่อประหยัดภาษีอย่างถูกกฎหมาย' },
  ],
  nr_advisory: [
    { icon: '💼', title: 'ที่ปรึกษาธุรกิจ', desc: 'ให้คำปรึกษาด้านการบริหารและกลยุทธ์ธุรกิจ' },
    { icon: '⚖️', title: 'ที่ปรึกษากฎหมาย', desc: 'ให้คำปรึกษาด้านกฎหมายธุรกิจและสัญญา' },
    { icon: '📈', title: 'วางระบบ ERP', desc: 'วางระบบบัญชีและ ERP สำหรับองค์กร' },
  ],
  model_mix: [
    { icon: '🎓', title: 'อบรมบัญชี CPD', desc: 'หลักสูตรนับชั่วโมง CPD สำหรับผู้ทำบัญชี' },
    { icon: '📚', title: 'สัมมนาภาษี', desc: 'อัปเดตกฎหมายภาษีล่าสุด' },
    { icon: '🏢', title: 'อบรมในองค์กร', desc: 'จัดอบรมภายในองค์กรตามความต้องการ' },
  ],
  cnr_group: [
    { icon: '🔍', title: 'ตรวจสอบบัญชี', desc: 'มาตรฐานสากล โดย CPA ที่ได้รับอนุญาต' },
    { icon: '📊', title: 'รับทำบัญชี', desc: 'ทำบัญชีครบวงจร ปิดงบ วางแผนภาษี' },
    { icon: '💼', title: 'ที่ปรึกษา', desc: 'ให้คำปรึกษาธุรกิจ กฎหมาย ภาษีครบวงจร' },
    { icon: '🎓', title: 'อบรมสัมมนา', desc: 'พัฒนาบุคลากรด้านบัญชีและภาษี' },
  ],
};

export function ServicesSection({ brand, showAllCompanies = false }: ServicesSectionProps) {
  const services = BRAND_SERVICES[brand.key] ?? [];

  return (
    <section id="services" className="cnr-section cnr-section--bg">
      <div className="cnr-container">
        <div className="text-center mb-12">
          <p className="section-eyebrow">SERVICES</p>
          <h2 className="section-title">บริการของเรา</h2>
          {showAllCompanies && (
            <p className="section-desc">บริการครบวงจรจากกลุ่มบริษัท CNR</p>
          )}
        </div>

        {/* Service Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((svc, i) => (
            <div key={i} className="cnr-card group">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, var(--brand-primary) 0%, var(--brand-primary-light) 100%)` }}
              >
                {svc.icon}
              </div>
              <h3 className="font-bold text-[var(--foreground)] mb-2">{svc.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{svc.desc}</p>
            </div>
          ))}
        </div>

        {/* Subsidiary Links (shown on CNR Group home) */}
        {showAllCompanies && (
          <>
            <div className="text-center mb-8">
              <p className="section-eyebrow">OUR COMPANIES</p>
              <h3 className="text-xl font-bold text-[var(--foreground)]">บริษัทในเครือ</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Object.values(BRANDS) as BrandConfig[])
                .filter((b) => b.key !== 'cnr_group')
                .map((b) => (
                  <Link
                    key={b.key}
                    href={b.routes.path}
                    className="cnr-card flex items-center gap-4 hover:border-[var(--brand-primary)]"
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                      style={{ background: b.colors.primary }}
                    >
                      {b.name.split(' ')[0].slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-[var(--foreground)]">{b.nameTh}</div>
                      <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{b.tagline}</div>
                    </div>
                    <ExternalLink size={14} className="ml-auto text-[var(--muted-foreground)]" />
                  </Link>
                ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
