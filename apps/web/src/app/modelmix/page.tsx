'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight, ExternalLink, Phone, MessageCircle, Instagram, Facebook, X } from 'lucide-react';
import { BRANDS } from '@/config/brands';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { useGallery } from '@/lib/useGallery';
import './modelmix.css';

// --- Hero Images ---
const HERO_IMAGES = [
  '/images/modelmix/banner-model-mix-1.png',
  '/images/modelmix/banner-model-mix-2.png',
];

// --- Service Data ---
const SERVICES = [
  {
    title: 'ให้คำปรึกษาทางด้านการตลาด',
    icon: '/images/modelmix/marketing_consult_icon.png',
    details: [
      'แนะนำและให้คำปรึกษาทางด้านการวางแผนการตลาด',
      'การส่งเสริมการตลาดของธุรกิจ',
      'เพื่อให้ดำเนินธุรกิจได้อย่างมีระบบ',
      'วางแผนการได้อย่างมีประสิทธิภาพ และประสบความสำเร็จได้ตามเป้าหมาย'
    ]
  },
  {
    title: 'จัดอบรมสัมมนาด้านบัญชีและภาษี',
    icon: '/images/modelmix/accounting_seminar_icon.png',
    details: [
      'ประกอบด้วยหลากหลายหลักสูตรตามความต้องการของลูกค้า',
      'อบรมสำหรับผู้ประกอบการ',
      'อบรมสำหรับนักบัญชี',
      'วิทยากรผู้เชี่ยวชาญระดับมืออาชีพ'
    ]
  }
];

// --- Awards Data ---
const AWARDS = [
  { src: '/images/modelmix/CERTIFICATIONS1.jpg', alt: 'ใบรับรอง 1', featured: true },
  { src: '/images/modelmix/CERTIFICATIONS2.jpg', alt: 'ใบรับรอง 2' },
  { src: '/images/modelmix/CERTIFICATIONS3.jpg', alt: 'ใบรับรอง 3' },
  { src: '/images/modelmix/CERTIFICATIONS4.jpg', alt: 'ใบรับรอง 4' },
  { src: '/images/modelmix/CERTIFICATIONS5.jpg', alt: 'ใบรับรอง 5' },
  { src: '/images/modelmix/CERTIFICATIONS6.jpg', alt: 'ใบรับรอง 6' },
  { src: '/images/modelmix/CERTIFICATIONS7.jpg', alt: 'ใบรับรอง 7' },
  { src: '/images/modelmix/CERTIFICATIONS8.jpg', alt: 'ใบรับรอง 8' },
  { src: '/images/modelmix/CERTIFICATIONS9.jpg', alt: 'ใบรับรอง 9' },
];

export default function ModelMixPage() {
  const brand = BRANDS.model_mix;
  const [currentHero, setCurrentHero] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);

  // Gallery: Combine static images with DB images
  const galleryAwards = useGallery('model_mix', 'CERTIFICATIONS');
  const activeAwards  = [
    ...AWARDS,
    ...galleryAwards.map(g => ({ src: g.imageUrl, alt: g.caption ?? 'ใบรับรอง', featured: false }))
  ];

  // Auto-slide hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="modelmix-page" data-brand="model_mix">
      <SiteHeader brand={brand} />

      <main>
        {/* --- Hero Slider --- */}
        <section className="relative overflow-hidden group">
          <div className="hero-slider">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHero}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={HERO_IMAGES[currentHero]}
                  alt="Model Mix Banner"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Slider Navigation */}
            <button
              onClick={() => setCurrentHero((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => setCurrentHero((prev) => (prev + 1) % HERO_IMAGES.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={24} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {HERO_IMAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentHero(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${currentHero === i ? 'bg-white scale-125' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* --- About Section --- */}
        <section id="history" className="cnr-section">
          <div className="cnr-container text-center">
            <p className="section-eyebrow-modelmix">ABOUT US</p>
            <h1 className="section-title">เกี่ยวกับเรา</h1>
            <div className="divider-modelmix"></div>
            <p className="mt-8 text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
              บริษัท โมเดล มิกซ์ จำกัด บริการจัดอบรมสัมมนาด้านบัญชี-ภาษี และธุรกิจ
              ด้วยประสบการณ์ในการให้คำปรึกษาด้านการจัดการ การวางแผนการตลาดและการสื่อสาร
              รวมถึงการจัดสัมมนาทางวิชาการและเป็นตัวแทนการค้าต่างประเทศ
              เรามุ่งมั่นที่จะเป็นส่วนหนึ่งในการพัฒนาบุคลากรและองค์กรให้เติบโตอย่างยั่งยืน
            </p>
          </div>
        </section>

        {/* --- Services Section --- */}
        <section id="services" className="cnr-section bg-gray-50">
          <div className="cnr-container">
            <div className="text-center mb-12">
              <p className="section-eyebrow-modelmix">SERVICES</p>
              <h2 className="section-title">บริการของเรา</h2>
              <div className="divider-modelmix"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {SERVICES.map((service, idx) => (
                <ServiceCard key={idx} service={service} />
              ))}
            </div>
          </div>
        </section>

        {/* --- Quotation Section --- */}
        <section className="quotation-section">
          <div className="cnr-container text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">ขอใบเสนอราคา</h2>
            <p className="text-white/90 mb-8 text-lg">แบบสอบถามข้อมูลเพื่อการเสนอราคาที่รวดเร็วและแม่นยำ</p>
            <a
              href="https://bit.ly/3w3pvEc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[var(--modelmix-orange)] font-bold rounded-full shadow-xl hover:scale-105 transition-transform"
            >
              รับใบเสนอราคา <ArrowRight size={20} />
            </a>
          </div>
        </section>

        {/* --- Awards Bento Grid --- */}
        <section id="awards" className="cnr-section">
          <div className="cnr-container">
            <div className="text-center mb-12">
              <p className="section-eyebrow-modelmix">CERTIFICATIONS</p>
              <h2 className="section-title">การรับรองและมาตรฐาน</h2>
              <div className="divider-modelmix"></div>
            </div>

            <div className="award-bento">
              {activeAwards.map((award, i) => (
                <div
                  key={i}
                  className={`award-card ${award.featured ? 'bento-featured' : 'bento-standard'}`}
                  onClick={() => setLightbox(award.src)}
                >
                  <Image
                    src={award.src}
                    alt={award.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Map Section --- */}
        <section id="map" className="cnr-section bg-gray-50">
          <div className="cnr-container">
            <div className="text-center mb-12">
              <p className="section-eyebrow-modelmix">LOCATION</p>
              <h2 className="section-title">แผนที่</h2>
              <div className="divider-modelmix"></div>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl border-8 border-white h-[450px]">
              <iframe
                src={brand.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter brand={brand} />

      {/* --- Lightbox Overlay --- */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button className="absolute top-6 right-6 text-white hover:rotate-90 transition-transform">
              <X size={40} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full aspect-[3/4] md:aspect-auto md:h-[90vh]"
            >
              <Image
                src={lightbox}
                alt="Enlarged Certification"
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-6 right-6 z-[90]">
        <AnimatePresence>
          {speedDialOpen && (
            <div className="flex flex-col-reverse gap-3 mb-3">
              <SpeedDialButton
                icon={<Phone size={24} />}
                href={`tel:${brand.contact.phone}`}
                color="#03E78B"
              />
              <SpeedDialButton
                icon={<Facebook size={24} />}
                href={brand.contact.facebook}
                color="#1877F2"
              />
              <SpeedDialButton
                icon={<MessageCircle size={24} />}
                href="https://m.me/CNRGroupCompany"
                color="#1E88E5"
              />
              <SpeedDialButton
                icon={<Instagram size={24} />}
                href={brand.contact.instagram!}
                color="#E4405F"
              />
            </div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setSpeedDialOpen(!speedDialOpen)}
          className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 ${speedDialOpen ? 'bg-gray-800 rotate-90' : 'bg-[var(--modelmix-orange)] hover:scale-110'}`}
        >
          {speedDialOpen ? <X size={32} /> : <MessageCircle size={32} />}
        </button>
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: any }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`modelmix-service-card flex flex-col h-full ${expanded ? 'ring-2 ring-[var(--modelmix-orange)]' : ''}`}>
      <div className="service-card-header">
        <Image src={service.icon} alt={service.title} fill className="object-cover" />
      </div>
      <h3 className="service-card-title">{service.title}</h3>
      <div className="service-card-body flex-1">
        <ul className="space-y-2">
          {service.details.map((detail: string, i: number) => (
            <motion.li
              key={i}
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm text-gray-600 flex items-start gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--modelmix-orange)] mt-1.5 flex-shrink-0" />
              <span>{detail}</span>
            </motion.li>
          ))}
        </ul>
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
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0, y: 20 }}
      className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
      style={{ backgroundColor: color }}
    >
      {icon}
    </motion.a>
  );
}
