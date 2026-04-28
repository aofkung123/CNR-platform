'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Phone,
  MessageCircle,
  Instagram,
  Facebook,
  X,
  Mail,
  MapPin,
  Star,
  Send
} from 'lucide-react';
import { BRANDS } from '@/config/brands';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
// import { NEWS } from '@/data/news'; // Removed static mock
import './cnrgroup.css';

// --- Configuration Data (Extracted from legacy js/config.js) ---
const HERO_BANNERS = [
  '/images/cnrgroup/banners/banner1.png',
  '/images/cnrgroup/banners/banner2.png',
  '/images/cnrgroup/banners/banner3.png',
  '/images/cnrgroup/banners/banner4.png',
];

const TESTIMONIALS = [
  '/images/cnrgroup/testimonials/t1.png',
  '/images/cnrgroup/testimonials/t2.png',
  '/images/cnrgroup/testimonials/t3.png',
  '/images/cnrgroup/testimonials/t4.png',
  '/images/cnrgroup/testimonials/t5.png',
  '/images/cnrgroup/testimonials/t6.png',
  '/images/cnrgroup/testimonials/t7.png',
  '/images/cnrgroup/testimonials/t8.png',
  '/images/cnrgroup/testimonials/t9.png',
  '/images/cnrgroup/testimonials/t10.png',
  '/images/cnrgroup/testimonials/t11.png',
];

const AWARDS = [
  '/images/cnrgroup/awards/award1.png',
  '/images/cnrgroup/awards/award2.png',
  '/images/cnrgroup/awards/award3.png',
  '/images/cnrgroup/awards/award4.png',
  '/images/cnrgroup/awards/award5.png',
  '/images/cnrgroup/awards/award6.png',
  '/images/cnrgroup/awards/award7.png',
  '/images/cnrgroup/awards/award8.png',
  '/images/cnrgroup/awards/award9.png',
  '/images/cnrgroup/awards/award10.png',
  '/images/cnrgroup/awards/award11.png',
  '/images/cnrgroup/awards/award12.png',
  '/images/cnrgroup/awards/award13.png',
  '/images/cnrgroup/awards/award14.png',
  '/images/cnrgroup/awards/award15.png',
  '/images/cnrgroup/awards/award16.png',
  '/images/cnrgroup/awards/award17.png',
  '/images/cnrgroup/awards/award18.png',
];



export default function CNRGroupPage() {
  const brand = BRANDS.cnr_group;
  const [currentHero, setCurrentHero] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentAward, setCurrentAward] = useState(0);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleNewsCount, setVisibleNewsCount] = useState(3);

  // Auto-slide hero
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-slide testimonial
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Auto-slide awards
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAward((prev) => (prev + 1) % AWARDS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  // Fetch real news from API
  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/v1/posts?status=PUBLISHED&limit=10');
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error('Failed to fetch news:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  return (
    <>
      <div className="cnrgroup-page" data-brand="cnr_group">
        <SiteHeader brand={brand} />

        <main>
          {/* --- Hero Slider --- */}
          <section className="relative overflow-hidden group">
            <div className="hero-slider">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHero}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={HERO_BANNERS[currentHero]}
                    alt="CNR Group Banner"
                    fill
                    className="object-cover"
                    priority />
                </motion.div>
              </AnimatePresence>

              <button
                onClick={() => setCurrentHero((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={() => setCurrentHero((prev) => (prev + 1) % HERO_BANNERS.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors"
              >
                <ChevronRight size={28} />
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {HERO_BANNERS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentHero(i)}
                    className={`w-3 h-3 rounded-full transition-all ${currentHero === i ? 'bg-white scale-125' : 'bg-white/40'}`} />
                ))}
              </div>
            </div>
          </section>

          {/* --- About Us / History --- */}
          <section id="history" className="cnr-section">
            <div className="cnr-container">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
                  <Image src="/images/cnrgroup/history/history.png" alt="History" fill className="object-cover" />
                </div>
                <div>
                  <p className="section-eyebrow">ABOUT US</p>
                  <h2 className="section-title text-left">ประวัติองค์กร</h2>
                  <p className="mt-6 text-lg text-gray-700 leading-relaxed">
                    CNR GROUP เราคือ บริษัทผู้ให้บริการด้านบัญชีอย่างมืออาชีพ
                    โดยบริการของเรา ประกอบไปด้วย บริการทำบัญชี ปิดงบการเงิน
                    ตรวจสอบบัญชี วางระบบการควบคุมภายใน การวางแผนภาษี
                    เทคโนโลยีและการให้คำปรึกษาด้านหลังบ้านธุรกิจ
                  </p>
                  <p className="mt-4 text-gray-600">
                    เรามีทีมงานมืออาชีพที่มีความรู้ ความเชี่ยวชาญ พร้อมให้บริการแก่ลูกค้าในทุกระดับ
                    และมีระบบงานมาตรฐานในการควบคุมคุณภาพ เพื่อให้ลูกค้าเกิดความพึงพอใจสูงสุด
                  </p>
                  <div className="flex gap-8 mt-8">
                    <div>
                      <div className="text-3xl font-bold text-[var(--brand-primary)] flex items-center gap-1">
                        4.9 <Star className="fill-current text-yellow-400" size={24} />
                      </div>
                      <div className="text-sm text-gray-500">จากลูกค้า 5,000+ ราย</div>
                    </div>
                    <div className="w-px h-12 bg-gray-200" />
                    <div>
                      <div className="text-3xl font-bold text-[var(--brand-primary)]">98%</div>
                      <div className="text-sm text-gray-500">ลูกค้าพึงพอใจ</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Services + Testimonial: Same Row ── */}
          <div className="section-row">
            {/* Left: Services */}
            <div className="col-services" id="services">
              <div className="cnr-container" style={{ padding: 0 }}>
                <div className="mb-8 text-center">
                  <p className="section-eyebrow">SERVICES</p>
                  <h2 className="section-title">บริการครบวงจร</h2>
                  <p className="section-subtitle mt-2">คลิกเพื่อเยี่ยมชมเว็บไซต์ของแต่ละบริษัทในเครือ</p>
                </div>
                <div className="services-card-grid">
                  <SubBrandCard brand={BRANDS.cac_audit} icon="/images/cnrgroup/services/cac.png" />
                  <SubBrandCard brand={BRANDS.nr_advisory} icon="/images/cnrgroup/services/nrgroup.png" />
                  <SubBrandCard brand={BRANDS.nr_accounting} icon="/images/cnrgroup/services/accounting.png" />
                  <a href="https://www.accrevo.com/" target="_blank" className="cnr-card-service">
                    <div className="card-logo-wrap">
                      <Image src="/images/cnrgroup/services/accrevo.png" alt="Accrevo" width={80} height={80} className="object-contain" />
                    </div>
                    <div className="card-text">
                      <div className="card-title">Accrevo</div>
                      <div className="card-tagline">แพลตฟอร์มบัญชีออนไลน์</div>
                    </div>
                    <div className="card-footer">
                      เยี่ยมชมเว็บไซต์ <ArrowRight size={14} />
                    </div>
                  </a>
                  <SubBrandCard brand={BRANDS.model_mix} icon="/images/cnrgroup/services/modelmix.png" />
                </div>
              </div>
            </div>

            {/* Right: Testimonial Slider */}
            <div className="col-testimonial" id="testimonial">
              <div className="cnr-container" style={{ padding: 0 }}>
                <div className="mb-6 text-center">
                  <p className="section-eyebrow">TESTIMONIAL</p>
                  <h2 className="section-title">ความประทับใจจากลูกค้า</h2>
                </div>

                <div className="testimonial-slider-wrap">
                  <button
                    className="testimonial-slider-btn prev"
                    onClick={() => setCurrentTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div style={{ overflow: 'hidden', padding: '0 2.5rem' }}>
                    <div
                      className="testimonial-slider-track"
                      style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                    >
                      {TESTIMONIALS.map((src, i) => (
                        <div key={i} className="testimonial-slide">
                          <img src={src} alt={`Testimonial ${i + 1}`} onClick={() => setLightbox(src)} />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className="testimonial-slider-btn next"
                    onClick={() => setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)}
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={20} />
                  </button>

                  <div className="testimonial-dots">
                    {TESTIMONIALS.map((_, i) => (
                      <button
                        key={i}
                        className={`testimonial-dot ${currentTestimonial === i ? 'active' : ''}`}
                        onClick={() => setCurrentTestimonial(i)}
                        aria-label={`Go to testimonial ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Awards --- */}
          <section id="awards" className="cnr-section" style={{ background: 'var(--brand-primary)', paddingTop: '4rem', paddingBottom: '4rem' }}>
            <div className="cnr-container">
              <div className="text-center mb-10">
                <p className="section-eyebrow" style={{ color: 'var(--brand-accent)' }}>AWARDS</p>
                <h2 className="section-title" style={{ color: '#fff' }}>รางวัลและความภูมิใจ</h2>
              </div>
              
              <div className="testimonial-slider-wrap" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <button
                  className="testimonial-slider-btn prev"
                  onClick={() => setCurrentAward((prev) => (prev - 1 + AWARDS.length) % AWARDS.length)}
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                >
                  <ChevronLeft size={20} />
                </button>

                <div style={{ overflow: 'hidden', padding: '0 1rem' }}>
                  <div
                    className="testimonial-slider-track"
                    style={{ transform: `translateX(-${currentAward * 100}%)` }}
                  >
                    {AWARDS.map((src, i) => (
                      <div key={i} className="testimonial-slide" style={{ padding: '1rem' }}>
                        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10 flex items-center justify-center aspect-video relative overflow-hidden group/award">
                          <Image 
                            src={src} 
                            alt={`Award ${i + 1}`} 
                            fill 
                            className="object-contain p-4 group-hover/award:scale-110 transition-transform duration-500" 
                            onClick={() => setLightbox(src)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className="testimonial-slider-btn next"
                  onClick={() => setCurrentAward((prev) => (prev + 1) % AWARDS.length)}
                  style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                >
                  <ChevronRight size={20} />
                </button>

                <div className="testimonial-dots">
                  {AWARDS.map((_, i) => (
                    <button
                      key={i}
                      className={`testimonial-dot ${currentAward === i ? 'active' : ''}`}
                      style={{ background: currentAward === i ? 'var(--brand-accent)' : 'rgba(255,255,255,0.3)' }}
                      onClick={() => setCurrentAward(i)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* --- News --- */}
          <section id="news" className="cnr-section">
            <div className="cnr-container">
              <div className="text-center mb-12">
                <p className="section-eyebrow">NEWS & INSIGHTS</p>
                <h2 className="section-title">ความรู้และข่าวสาร</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {loading ? (
                  // Skeleton Loading
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                      <div className="aspect-video bg-gray-200" />
                      <div className="p-6">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                        <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                        <div className="h-4 bg-gray-200 rounded w-2/3" />
                      </div>
                    </div>
                  ))
                ) : posts.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-gray-400">
                    ยังไม่มีข่าวสารในขณะนี้
                  </div>
                ) : (
                  posts.slice(0, visibleNewsCount).map((item) => (
                    <article key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow group">
                      <Link href={`/news/${item.slug}`} className="block">
                        <div className="aspect-video relative overflow-hidden bg-gray-100">
                          {item.thumbnailUrl ? (
                            <Image src={item.thumbnailUrl} alt={item.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-300">
                              CNR GROUP
                            </div>
                          )}
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-600">
                              {item.category}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {new Date(item.createdAt).toLocaleDateString('th-TH')}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-[var(--brand-primary)] transition-colors">{item.title}</h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{item.summary}</p>
                          <span className="text-[var(--brand-primary)] font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                            อ่านต่อ <ArrowRight size={16} />
                          </span>
                        </div>
                      </Link>
                    </article>
                  ))
                )}
              </div>

              {/* View More / Show Less Button */}
              {posts.length > 3 && (
                <div className="mt-12 text-center">
                  <button 
                    onClick={() => setVisibleNewsCount(visibleNewsCount > 3 ? 3 : posts.length)}
                    className="btn-outline px-10 group"
                  >
                    {visibleNewsCount > 3 ? 'ย่อข่าวสารลง' : 'ดูข่าวสารเพิ่มเติม'}
                    <ArrowRight 
                      size={18} 
                      className={`transition-transform duration-300 ${visibleNewsCount > 3 ? '-rotate-90' : 'group-hover:translate-x-1'}`} 
                    />
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* --- Map --- */}
          <section id="map" className="cnr-section">
            <div className="cnr-container">
              <div className="text-center mb-10">
                <p className="section-eyebrow">LOCATION</p>
                <h2 className="section-title">แผนที่การเดินทาง</h2>
              </div>
              <div className="h-[450px] relative rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                <iframe
                  src={brand.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </div>
          </section>

          {/* --- Contact Section --- */}
          <section id="contact" className="cnr-section bg-gray-50">
            <div className="cnr-container">
              <div className="grid lg:grid-cols-2 gap-16">
                <div>
                  <p className="section-eyebrow">CONTACT US</p>
                  <h2 className="section-title text-left">ติดต่อเรา</h2>
                  <div className="mt-8 space-y-6">
                    <ContactInfoItem icon={<Phone />} label="โทรศัพท์" value={brand.contact.phone} href={`tel:${brand.contact.phone}`} />
                    <ContactInfoItem icon={<Mail />} label="อีเมล" value={brand.contact.email} href={`mailto:${brand.contact.email}`} />
                    <ContactInfoItem icon={<MapPin />} label="ที่อยู่" value={brand.contact.address} />
                    <div className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                      <a href="https://line.me/ti/p/~@cnrgroup" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                        <Image src={brand.lineQrSrc} alt="Line QR" width={80} height={80} />
                      </a>
                      <div>
                        <div className="font-bold text-gray-900">LINE Official</div>
                        <div className="text-[var(--brand-primary)] font-bold text-lg">{brand.contact.lineId}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                  <h3 className="text-2xl font-bold mb-6">ส่งข้อความถึงเรา</h3>
                  <form className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input type="text" placeholder="ชื่อ-นามสกุล" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none" />
                      <input type="tel" placeholder="เบอร์โทรศัพท์" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none" />
                    </div>
                    <input type="email" placeholder="อีเมล" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none" />
                    <textarea rows={4} placeholder="รายละเอียด" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none"></textarea>
                    <button className="w-full py-4 bg-[var(--brand-primary)] text-white font-bold rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2">
                      ส่งข้อความ <Send size={20} />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* --- Lightbox --- */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
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
    </>
  );
}

function SubBrandCard({ brand, icon }: { brand: any; icon: string }) {
  return (
    <a href={brand.routes.path} className="cnr-card-service">
      <div className="card-logo-wrap">
        <Image src={icon} alt={brand.name} width={80} height={80} className="object-contain" />
      </div>
      <div className="card-text">
        <div className="card-title">{brand.nameTh}</div>
        <div className="card-tagline">{brand.tagline}</div>
      </div>
      <div className="card-footer">
        เยี่ยมชมเว็บไซต์ <ArrowRight size={14} />
      </div>
    </a>
  );
}

function ContactInfoItem({ icon, label, value, href }: any) {
  const content = (
    <div className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-[var(--brand-primary)]">
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
        <div className="font-bold text-gray-900">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="block">{content}</a> : content;
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
      className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
      style={{ backgroundColor: color }}
    >
      {icon}
    </motion.a>
  );
}
