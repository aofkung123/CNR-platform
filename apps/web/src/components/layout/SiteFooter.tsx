import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';
import type { BrandConfig } from '@/config/brands';

export function SiteFooter({ brand }: { brand: BrandConfig }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="cnr-container">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 py-12">
          {/* Brand & Contact */}
          <div className="lg:col-span-1">
            <Image
              src={brand.logoSrc}
              alt={brand.name}
              width={160}
              height={54}
              className="h-14 w-auto object-contain brightness-0 invert mb-6"
            />
            <div className="space-y-4">
              <a href={`tel:${brand.contact.phone}`} className="flex items-center gap-3 text-white/70 text-base hover:text-white transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={14} />
                </div>
                {brand.contact.phone}
              </a>
              <a href={`mailto:${brand.contact.email}`} className="flex items-center gap-3 text-white/70 text-base hover:text-white transition-colors">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={14} />
                </div>
                {brand.contact.email}
              </a>
              <div className="flex items-start gap-3 text-white/70 text-base">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={14} />
                </div>
                <span>{brand.contact.address}</span>
              </div>
            </div>
          </div>

          {/* Facebook Plugin (Specific to Model Mix or if FB configured) */}
          <div className="hidden lg:block lg:col-span-1">
            <h4 className="text-white font-bold mb-6 text-base uppercase tracking-wider">Facebook</h4>
            <div className="rounded-xl overflow-hidden bg-white h-[200px]">
              <iframe
                src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(brand.contact.facebook)}&tabs=timeline&width=250&height=200&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=true`}
                width="250"
                height="200"
                style={{ border: 'none', overflow: 'hidden' }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>
          </div>

          {/* LINE QR Code */}
          <div className="lg:col-span-1 text-center">
            <h4 className="text-white font-bold mb-6 text-base uppercase tracking-wider">Line Official</h4>
            <div className="inline-block p-2 bg-white rounded-2xl mb-3 shadow-lg hover:scale-110 transition-transform">
              <a href="https://line.me/ti/p/~@cnrgroup" target="_blank" rel="noopener noreferrer">
                <Image
                  src={brand.lineQrSrc}
                  alt="LINE QR Code"
                  width={120}
                  height={120}
                  className="rounded-xl"
                />
              </a>
            </div>
            <p className="text-white font-bold text-lg">{brand.contact.lineId}</p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-white font-bold mb-6 text-base uppercase tracking-wider">Quick Links</h4>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {['ประวัติ', 'บริการ', 'รีวิว', 'รางวัล', 'แผนที่', 'ติดต่อ'].map((label, i) => (
                <a
                  key={i}
                  href={`#${['history', 'services', 'testimonial', 'awards', 'map', 'contact'][i]}`}
                  className="text-white/70 text-base hover:text-white transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-xs uppercase tracking-widest">
          <p>&copy; {year} {brand.nameTh}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ContactFooterCard({ icon, label, value, href }: any) {
  const content = (
    <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:bg-[var(--brand-primary)] transition-colors">
        {icon}
      </div>
      <div>
        <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">{label}</div>
        <div className="font-bold text-white text-sm line-clamp-1">{value}</div>
      </div>
    </div>
  );
  return href ? <a href={href} className="block">{content}</a> : content;
}
