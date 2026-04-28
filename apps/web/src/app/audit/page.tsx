'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useGallery } from '@/lib/useGallery';
import { 
  ArrowRight, 
  Phone, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  X,
  Mail,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { BRANDS } from '@/config/brands';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import './audit.css';

const SERVICES = [
  {
    title: 'ตรวจสอบบัญชี-งบการเงินประจำปี',
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <path fill="#e8eaf6" d="M14 6h26l14 14v38a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4z" />
        <path fill="#c5cae9" d="M40 6v14h14L40 6z" />
        <rect x="20" y="30" width="24" height="2" rx="1" fill="#9fa8da" />
        <rect x="20" y="38" width="16" height="2" rx="1" fill="#9fa8da" />
        <circle cx="44" cy="44" r="12" fill="#ffd54f" />
        <path fill="none" d="M39 44l3 3 6-6" stroke="#37474f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    desc: 'โดยผู้สอบบัญชีรับอนุญาต (CPA) โดยปฏิบัติงานตรวจสอบตามมาตรฐานการสอบบัญชีที่กำหนดไว้ตามกฎหมายหรือประกาศของสภาวิชาชีพบัญชี',
  },
  {
    title: 'ตรวจสอบบัญชีและรับรองบัญชีห้างหุ้นส่วนจดทะเบียน',
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <path fill="#e8eaf6" d="M12 10h24v44H12z" />
        <rect x="16" y="16" width="16" height="2" fill="#9fa8da" />
        <rect x="16" y="22" width="10" height="2" fill="#9fa8da" />
        <rect x="28" y="24" width="26" height="34" rx="3" fill="#ffffff" stroke="#9fa8da" strokeWidth="2" />
        <rect x="32" y="28" width="18" height="8" rx="1" fill="#e8eaf6" />
        <rect x="32" y="40" width="4" height="4" rx="1" fill="#ffd54f" />
        <rect x="39" y="40" width="4" height="4" rx="1" fill="#5c6bc0" />
        <rect x="46" y="40" width="4" height="4" rx="1" fill="#5c6bc0" />
        <rect x="32" y="47" width="4" height="4" rx="1" fill="#5c6bc0" />
        <rect x="39" y="47" width="4" height="4" rx="1" fill="#5c6bc0" />
        <rect x="46" y="47" width="4" height="4" rx="1" fill="#ffd54f" />
      </svg>
    ),
    desc: 'โดยผู้สอบบัญชีภาษีอากร (TA) โดยปฏิบัติงานตรวจสอบตามหลักเกณฑ์ วิธีการ และเงื่อนไขที่อธิบดีกรมสรรพากรกำหนด',
  },
  {
    title: 'เสนอข้อสังเกตต่อผู้บริหาร',
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <rect x="8" y="14" width="48" height="32" rx="2" fill="#e8eaf6" />
        <path fill="#c5cae9" d="M8 42h48v4H8z" />
        <path fill="#9fa8da" d="M30 46h4v12h-4z" />
        <path fill="#9fa8da" d="M22 58h20v2H22z" />
        <rect x="16" y="32" width="6" height="10" fill="#c5cae9" />
        <rect x="26" y="24" width="6" height="18" fill="#9fa8da" />
        <rect x="36" y="28" width="6" height="14" fill="#5c6bc0" />
        <rect x="46" y="18" width="6" height="24" fill="#ffd54f" />
        <path fill="none" stroke="#ffca28" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M19 32l10-8 10 4 10-10" />
      </svg>
    ),
    desc: 'ต่อผู้บริหารเพื่อให้ทราบถึงจุดอ่อนของการควบคุมภายในทางบัญชีที่สำคัญ รวมทั้งแจ้งให้ทราบถึงข้อผิดพลาดทางการบัญชี พร้อมข้อเสนอแนะ',
  },
  {
    title: 'ตรวจสอบเฉพาะกรณี ตามข้อตกลง',
    icon: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <path fill="#e8eaf6" d="M16 8h32v48H16z" />
        <rect x="24" y="20" width="16" height="2" fill="#c5cae9" />
        <rect x="24" y="28" width="10" height="2" fill="#c5cae9" />
        <rect x="24" y="36" width="12" height="2" fill="#c5cae9" />
        <path fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" d="M48 48l8 8" />
        <circle cx="38" cy="38" r="14" fill="#ffd54f" opacity="0.9" />
        <circle cx="38" cy="38" r="14" fill="none" stroke="#ffffff" strokeWidth="3" />
        <circle cx="36" cy="36" r="4" fill="#ffffff" opacity="0.6" />
      </svg>
    ),
    desc: 'บริการตรวจสอบตามความต้องการเฉพาะของลูกค้า ตามข้อตกลงที่กำหนด',
  }
];

const INDUSTRIES = [
  { label: 'Technology & Digital Platform', src: '/images/audit/business-sectors/tech-digital.jpg' },
  { label: 'Retail and Consumer', src: '/images/audit/business-sectors/retail-consumer.jpg' },
  { label: 'Industrial Manufacturing', src: '/images/audit/business-sectors/industrial-manufacturing.jpg' },
  { label: 'E-Commerce', src: '/images/audit/business-sectors/ecommerce.jpg' },
  { label: 'Healthcare', src: '/images/audit/business-sectors/healthcare.jpg' },
  { label: 'Wellness & Spa', src: '/images/audit/business-sectors/wellness-spa.jpg' },
  { label: 'Cooperative Fund', src: '/images/audit/business-sectors/cooperative-fund.jpg' },
  { label: 'Real estate & Hotel', src: '/images/audit/business-sectors/real-estate-hotel.jpg' },
  { label: 'Entertainment and Media', src: '/images/audit/business-sectors/entertainment-media.jpg' },
  { label: 'Oil and Gas', src: '/images/audit/business-sectors/oil-gas.jpg' },
];

const AWARDS = [
  '/images/audit/business-sectors/award-1.png',
  '/images/audit/business-sectors/award-2.jpg',
  '/images/audit/business-sectors/award-3.jpg',
  '/images/audit/business-sectors/award-4.png',
];

export default function AuditPage() {
  const brand = BRANDS.cac_audit;
  const [speedDialOpen, setSpeedDialOpen] = useState(false);  // Gallery: Combine static images with DB images
  const galleryIndustries = useGallery('cac_audit', 'INDUSTRIES');
  const galleryAwards     = useGallery('cac_audit', 'AWARDS');

  const activeIndustries = [
    ...INDUSTRIES,
    ...galleryIndustries.map(g => ({ label: g.caption ?? '', src: g.imageUrl }))
  ];
  const activeAwards = [
    ...AWARDS,
    ...galleryAwards.map(g => g.imageUrl)
  ];


  return (
    <div className="audit-page" data-brand="cac_audit">
      <SiteHeader brand={brand} />

      <main>
        {/* --- Hero --- */}
        <section className="relative overflow-hidden group">
          <div className="hero-slider">
            <Image src="/images/audit/business-sectors/hero-main.jpg" alt="CAC Audit" fill className="object-cover" priority />
          </div>
        </section>

        {/* --- About --- */}
        <section id="history" className="cnr-section">
          <div className="cnr-container">
            <div className="max-w-4xl mx-auto text-center">
              <p className="section-eyebrow">ABOUT US</p>
              <h2 className="section-title">ประวัติองค์กร</h2>
              <div className="divider"></div>
              <div className="mt-8 space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  บริษัท ซีเอซี ออดิท จำกัด ให้บริการด้านตรวจสอบบัญชีให้เป็นไปตามมาตรฐานการสอบบัญชีที่รับรองทั่วไป
                  จัดทำหนังสือแจ้งผลตรวจสอบบัญชีระหว่างปีและสิ้นปี (Management Letter)
                </p>
                <p>
                  เราตรวจสอบบัญชีด้วยทีมงานมืออาชีพ โดยทีมงานผู้สอบบัญชีรับอนุญาต (CPA) และผู้สอบบัญชีภาษีอากร (TA)
                  ที่มีความรู้ความสามารถและประสบการณ์ในด้านการตรวจสอบบัญชีหลากหลายธุรกิจ
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Services --- */}
        <section id="service" className="cnr-section bg-gray-50">
          <div className="cnr-container">
            <div className="text-center mb-12">
              <p className="section-eyebrow">SERVICES</p>
              <h2 className="section-title">บริการของเรา</h2>
              <div className="divider"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {SERVICES.map((svc, i) => (
                <div key={i} className="audit-service-card flex flex-col h-full">
                  <div className="service-card-header">
                    {svc.icon}
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
        <section className="audit-quotation">
          <div className="cnr-container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ขอใบเสนอราคา</h2>
            <p className="text-blue-100 mb-8">แบบสอบถามข้อมูลเพื่อการเสนอราคาสอบบัญชี (CAC Audit)</p>
            <a href="https://forms.gle/MHGE1VoKNiSLtmUn7" target="_blank" className="btn-white">
              รับใบเสนอราคา <ArrowRight size={20} />
            </a>
          </div>
        </section>

        {/* --- Industries --- */}
        <section id="indus" className="cnr-section">
          <div className="cnr-container">
            <div className="text-center mb-12">
              <p className="section-eyebrow">INDUSTRIES</p>
              <h2 className="section-title">ความเชี่ยวชาญในกลุ่มธุรกิจ</h2>
              <div className="divider"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {activeIndustries.map((item, i) => (
                <div key={i} className="industry-card group">
                  <div className="aspect-[4/3] relative rounded-2xl overflow-hidden mb-3">
                    <img 
                      src={item.src} 
                      alt={item.label} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <p className="text-sm font-medium text-center text-gray-700">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Awards --- */}
        <section id="Awards" className="cnr-section bg-gray-50">
          <div className="cnr-container">
            <div className="text-center mb-12">
              <p className="section-eyebrow">AWARDS</p>
              <h2 className="section-title">รางวัลและการรับรอง</h2>
              <div className="divider"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {activeAwards.map((src, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 aspect-[3/4] relative">
                  <Image src={src} alt={`Award ${i+1}`} fill className="object-contain p-4" />
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

function SpeedDialButton({ icon, href, color }: any) {
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
