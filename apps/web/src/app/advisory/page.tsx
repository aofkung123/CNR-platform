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
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { BRANDS } from '@/config/brands';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import './advisory.css';

const SERVICES = [
  {
    title: 'วางระบบบัญชี',
    icon: '📊',
    desc: 'บริการออกแบบหรือปรับปรุงขั้นตอนการปฏิบัติงานด้านบัญชีการเงินและบัญชีต้นทุน รวมถึงการออกแบบเอกสารและจัดทำรายงาน',
  },
  {
    title: 'วางแผนภาษีอากร',
    icon: '🧾',
    desc: 'แนะนำและให้คำปรึกษาในการวางแผนจัดโครงสร้างการเสียภาษีอากรของธุรกิจ เพื่อให้ถูกต้องตามกฎหมายและมีประสิทธิภาพสูงสุด',
  },
  {
    title: 'ที่ปรึกษาด้านการบัญชีและภาษีอากร',
    icon: '💼',
    desc: 'บริการโดยผู้เชี่ยวชาญ เพื่อให้มั่นใจว่าการดำเนินการถูกต้องตามมาตรฐานการบัญชีและประมวลรัษฎากร',
  },
  {
    title: 'การให้คำปรึกษาและวางแผนงาน',
    icon: '🏗️',
    desc: 'การวางโครงสร้างธุรกิจ, ออกแบบระบบสารสนเทศทางการบัญชี, Set up & Implement Software',
  }
];

const POLICIES = [
  'มุ่งเน้นปฏิบัติตามกฎหมายและข้อกำหนดการอนุรักษ์สิ่งแวดล้อม',
  'กำหนดมาตรการการใช้พลังงานและทรัพยากรอย่างคุ้มค่า',
  'ส่งเสริมการจัดจ้างบุคลากรอย่างเป็นมิตรกับสิ่งแวดล้อม',
  'ปรับปรุงสภาพแวดล้อมและความปลอดภัยในสำนักงาน',
  'ประชาสัมพันธ์นโยบายสิ่งแวดล้อมต่อบุคลากร',
  'ประชุมทบทวนฝ่ายบริหารอย่างน้อยปีละ 1 ครั้ง'
];

export default function AdvisoryPage() {
  const brand = BRANDS.nr_advisory;
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  return (
    <div className="advisory-page" data-brand="nr_advisory">
      <SiteHeader brand={brand} />

      <main>
        {/* --- Hero --- */}
        <section className="relative overflow-hidden group">
          <div className="hero-slider">
            <Image src="/images/advisory/banner1.jpg" alt="NR Group Advisory" fill className="object-cover" priority />
          </div>
        </section>

        {/* --- About --- */}
        <section id="history" className="cnr-section">
          <div className="cnr-container">
            <div className="max-w-4xl mx-auto">
              <p className="section-eyebrow text-center">ABOUT US</p>
              <h2 className="section-title text-center">ประวัติองค์กร</h2>
              <div className="divider mx-auto"></div>
              <p className="mt-8 text-xl text-gray-700 text-center leading-relaxed">
                บริษัท เอ็น.อาร์.กรุ๊ป แอดไวซอรี่ จำกัด ให้บริการด้านที่ปรึกษาในการจัดการ :
                การออกแบบระบบบัญชีและการจัดการ ให้บริการเป็นที่ปรึกษาด้านธุรกิจและกฎหมาย รับตรวจสอบภายใน
                วางแผนทางด้านภาษีอากรและขอคืนภาษี
              </p>
            </div>
          </div>
        </section>

        {/* --- Environmental Policy --- */}
        <section id="environmental-policy" className="cnr-section bg-blue-50">
          <div className="cnr-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="section-eyebrow">ENVIRONMENTAL POLICY</p>
                <h2 className="section-title text-left">นโยบายสิ่งแวดล้อม</h2>
                <div className="divider-left"></div>
                <p className="mt-6 font-bold text-lg text-gray-900 italic">
                  &quot;N.R. Group Advisory: ขับเคลื่อนธุรกิจด้วยความรับผิดชอบ เพื่อโลกที่ยั่งยืน&quot;
                </p>
                <p className="mt-4 text-gray-600">
                  เรามุ่งมั่นยกระดับองค์กรสู่มาตรฐาน Green Office โดยบูรณาการหลักการ ESG เข้ากับทุกกระบวนการทำงาน
                </p>
                <ul className="mt-8 space-y-3">
                  {POLICIES.map((policy, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <CheckCircle2 className="text-[var(--brand-primary)] flex-shrink-0" size={20} />
                      <span className="text-gray-700">{policy}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
                <Image src="/images/advisory/environmental-policy.jpg" alt="Environmental Policy" fill className="object-cover" />
              </div>
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
                <div key={i} className="advisory-service-card flex flex-col h-full">
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
        <section className="advisory-quotation">
          <div className="cnr-container text-center">
            <h2 className="text-3xl font-bold mb-4">ขอใบเสนอราคา</h2>
            <p className="mb-8 opacity-90">แบบสอบถามข้อมูลลูกค้าเพื่อเสนอราคาที่ปรึกษาธุรกิจ</p>
            <a href="https://bit.ly/3eG1bSM" target="_blank" className="btn-accent">
              รับใบเสนอราคา <ArrowRight size={20} />
            </a>
          </div>
        </section>

        {/* --- Awards --- */}
        <section id="Awards" className="cnr-section bg-gray-50">
          <div className="cnr-container">
            <div className="text-center mb-12">
              <p className="section-eyebrow">AWARDS</p>
              <h2 className="section-title">รางวัลแห่งความสำเร็จ</h2>
              <div className="divider mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {['cer4.png', 'cer1.jpg', 'cer3.jpg', 'cer2.jpg'].map((img, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 aspect-[3/4] relative overflow-hidden group">
                  <Image src={`/images/advisory/${img}`} alt={`Award ${i+1}`} fill className="object-contain p-2 group-hover:scale-110 transition-transform" />
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
              <SpeedDialButton icon={<Instagram />} href={brand.contact.instagram!} color="#E4405F" />
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
