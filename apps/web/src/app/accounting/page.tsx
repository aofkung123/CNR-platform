'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  X,
  Check,
  ChevronDown,
  ExternalLink
} from 'lucide-react';
import { BRANDS } from '@/config/brands';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { useGallery } from '@/lib/useGallery';
import './accounting.css';

const SCOPES = [
  {
    title: 'งานจัดทำบัญชี',
    icon: '/images/accounting/accounting_icon.png',
    items: [
      'บันทึกรายการบัญชีตามเอกสารหลักฐาน',
      'จัดทำสมุดบัญชีขาย / สมุดบัญชีซื้อ',
      'จัดทำสมุดบัญชีรับเงิน / สมุดบัญชีจ่ายเงิน',
      'จัดทำสมุดบัญชีรายวันทั่วไป / สมุดบัญชีแยกประเภท',
      'จัดทำงบทดลอง และรายงานงบการเงิน',
      'จัดทำทะเบียนสินทรัพย์ถาวร',
      'จัดเตรียมข้อมูลเพื่อผู้ตรวจสอบบัญชีตรวจสอบ'
    ]
  },
  {
    title: 'งานด้านภาษี',
    icon: '/images/accounting/tax_icon.png',
    items: [
      'ภาษีหัก ณ ที่จ่าย (ภ.ง.ด. 1, 2, 3, 53)',
      'ภาษีมูลค่าเพิ่ม (VAT) (ภ.พ.30, ภ.พ.36)',
      'ภาษีเงินได้นิติบุคคล (ภ.ง.ด.50, 51)',
      'ภาษีธุรกิจเฉพาะ (ภ.ธ.40)',
      'ภาษีเงินได้บุคคลธรรมดา (ภ.ง.ด.90, 91)',
      'อากรแสตมป์',
      'ประกันสังคม (สปส.1-10)'
    ]
  }
];

const SERVICES = [
  {
    title: 'ยื่นแบบประจำเดือน',
    desc: 'ให้คำแนะนำการยื่น VAT, จัดทำและยื่นภาษีเงินได้ (ภงด.1, 3, 53), ภพ.30, และประกันสังคม',
    icon: '📅'
  },
  {
    title: 'ยื่นแบบประจำปี',
    desc: 'จัดทำและยื่นภาษี ภงด.51, ภงด.50, สบช.3 และภาษีหัก ณ ที่จ่ายพนักงานประจำปี',
    icon: '📊'
  },
  {
    title: 'ปิดบัญชีประจำเดือน',
    desc: 'บันทึกรายการค้า, จัดทำสมุดบัญชีทุกประเภท, งบทดลอง, งบกระทบยอด และลงทะเบียนผู้ทำบัญชี',
    icon: '📔'
  },
  {
    title: 'รับจดทะเบียน',
    desc: 'จดทะเบียนจัดตั้งและเลิกบริษัท, ทะเบียนห้างหุ้นส่วน, ทะเบียนพาณิชย์ และเครื่องหมายการค้า',
    icon: '📜'
  }
];

const AWARDS = [
  { src: '/images/accounting/showdown.jpg', featured: true },
  { src: '/images/accounting/trofy.jpg' },
  { src: '/images/accounting/cer7.png' },
  { src: '/images/accounting/cer6.png' },
  { src: '/images/accounting/cer2.jpg' },
  { src: '/images/accounting/cer3.jpg' },
  { src: '/images/accounting/cer4.jpg' },
  { src: '/images/accounting/cer5.jpg' },
  { src: '/images/accounting/cer1.jpg' },
];

export default function AccountingPage() {
  const brand = BRANDS.nr_accounting;
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Gallery: Combine static images with DB images
  const galleryAwards = useGallery('nr_accounting', 'AWARDS');
  const activeAwards  = [
    ...AWARDS,
    ...galleryAwards.map(g => ({ src: g.imageUrl, featured: false }))
  ];

  return (
    <div className="accounting-page" data-brand="nr_accounting">
      <SiteHeader brand={brand} />

      <main>
        {/* --- Hero --- */}
        <section className="relative overflow-hidden group">
          <div className="hero-slider">
            <Image src="/images/accounting/1banner-nr-account.png" alt="NR Group Accounting" fill className="object-cover" priority />
          </div>
        </section>

        {/* --- About --- */}
        <section id="history" className="cnr-section">
          <div className="cnr-container">
            <div className="max-w-4xl mx-auto text-center">
              <p className="section-eyebrow">ABOUT US</p>
              <h2 className="section-title">ประวัติองค์กร</h2>
              <div className="divider mx-auto"></div>
              <p className="mt-8 text-xl text-gray-700 leading-relaxed">
                บริษัท เอ็น.อาร์.กรุ๊ป แอ็คเคาท์ติ้ง จำกัด สำนักงานบัญชีคุณภาพ และสำนักงานบัญชีดิจิทอล
                ที่ได้รับธรรมาภิบาลธุรกิจ ให้บริการด้านทำบัญชีครบวงจร ในการจัดทำบัญชีที่เป็นไปตามมาตรฐานรายการทางการเงิน
                ของกฎหมายไทยและสอดคล้องกับประมวลรัษฎากร
              </p>
            </div>
          </div>
        </section>

        {/* --- Scope of Service --- */}
        <section id="scope" className="cnr-section bg-gray-50">
          <div className="cnr-container">
            <div className="text-center mb-12">
              <p className="section-eyebrow">SCOPE OF SERVICE</p>
              <h2 className="section-title">ขอบเขตการให้บริการ</h2>
              <div className="divider mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {SCOPES.map((scope, i) => (
                <div key={i} className="accounting-scope-card">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 relative flex-shrink-0">
                      <Image src={scope.icon} alt={scope.title} fill className="object-contain" />
                    </div>
                    <h3 className="text-2xl font-bold">{scope.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {scope.items.map((item, idx) => (
                      <li key={idx} className="flex gap-3 items-start text-gray-600">
                        <Check className="text-[var(--brand-primary)] mt-1 flex-shrink-0" size={18} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Services --- */}
        <section id="service" className="cnr-section">
          <div className="cnr-container">
            <div className="text-center mb-12">
              <p className="section-eyebrow">SERVICES</p>
              <h2 className="section-title">บริการของเรา</h2>
              <div className="divider mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {SERVICES.map((svc, i) => (
                <div key={i} className="accounting-service-card flex flex-col h-full">
                  <div className="service-card-header">
                    <span className="emoji">{svc.icon}</span>
                  </div>
                  <h3 className="service-card-title">{svc.title}</h3>
                  <div className="service-card-body flex-1">
                    <ul className="space-y-3">
                      <li className="text-sm text-gray-600 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] mt-1.5 flex-shrink-0" />
                        <span>{svc.desc}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Quotation --- */}
        <section className="accounting-quotation">
          <div className="cnr-container text-center">
            <h2 className="text-3xl font-bold mb-4">ขอใบเสนอราคา</h2>
            <p className="mb-8 text-green-100">แบบสอบถามข้อมูลเพื่อการเสนอราคาที่รวดเร็วและแม่นยำ</p>
            <a href="https://bit.ly/3w3pvEc" target="_blank" className="btn-accent">
              รับใบเสนอราคา <ArrowRight size={20} />
            </a>
          </div>
        </section>

        {/* --- Awards Bento --- */}
        <section id="awards" className="cnr-section">
          <div className="cnr-container">
            <div className="text-center mb-12">
              <p className="section-eyebrow">AWARDS</p>
              <h2 className="section-title">รางวัลและใบรับรอง</h2>
              <div className="divider mx-auto"></div>
            </div>
            <div className="award-bento">
              {activeAwards.map((award, i) => (
                <div 
                  key={i} 
                  className={`relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer border border-gray-100 ${award.featured ? 'md:col-span-2 md:row-span-2 aspect-square md:aspect-auto' : 'aspect-square'}`}
                  onClick={() => setLightbox(award.src)}
                >
                  <Image src={award.src} alt="Award" fill className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Map --- */}
        <section id="map" className="h-[450px]">
          <iframe
            src={brand.mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </section>
      </main>

      <SiteFooter brand={brand} />

      {/* --- Lightbox --- */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-white"><X size={40} /></button>
            <div className="relative w-full max-w-4xl h-[80vh]">
              <Image src={lightbox} alt="Full view" fill className="object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Speed Dial --- */}
      <div className="fixed bottom-6 right-6 z-[90]">
        <AnimatePresence>
          {speedDialOpen && (
            <div className="flex flex-col-reverse gap-3 mb-3">
              <SpeedDialButton icon={<Phone />} href={`tel:${brand.contact.phone}`} color="#03E78B" />
              <SpeedDialButton icon={<Facebook />} href={brand.contact.facebook} color="#1877F2" />
              <SpeedDialButton icon={<MessageCircle />} href="https://m.me/CNRGroupCompany" color="#1E88E5" />
              <SpeedDialButton icon={<Instagram />} href="https://www.instagram.com/cnrgroup.th/" color="#E4405F" />
            </div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setSpeedDialOpen(!speedDialOpen)}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${speedDialOpen ? 'bg-gray-800 rotate-90' : 'bg-[var(--brand-primary)] hover:scale-110'}`}
        >
          {speedDialOpen ? <X size={32} /> : <MessageCircle size={32} />}
        </button>
      </div>
    </div>
  );
}

interface SpeedDialProps {
  icon: React.ReactNode;
  href: string;
  color: string;
}

function SpeedDialButton({ icon, href, color }: SpeedDialProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 20 }}
      className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg"
      style={{ backgroundColor: color }}
    >
      {icon}
    </motion.a>
  );
}
