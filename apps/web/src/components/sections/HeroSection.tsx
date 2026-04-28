import { ArrowRight } from 'lucide-react';
import type { BrandConfig } from '@/config/brands';

export function HeroSection({ brand }: { brand: BrandConfig }) {
  return (
    <section
      id="hero"
      className="hero-section"
      aria-label="แบนเนอร์หลัก"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'var(--brand-accent)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10 blur-2xl"
          style={{ background: 'var(--brand-primary-light)' }}
        />
      </div>

      <div className="cnr-container relative z-10">
        <div className="max-w-2xl">
          <p className="text-white/70 text-sm font-semibold tracking-widest uppercase mb-4 animate-fade-in">
            {brand.name}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 animate-fade-up">
            {brand.nameTh}
          </h1>
          <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {brand.tagline}
          </p>
          <div className="flex flex-wrap gap-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white shadow-lg
                         transition-all duration-300 hover:scale-105 hover:shadow-xl"
              style={{ background: 'var(--brand-accent)' }}
            >
              ปรึกษาเรา <ArrowRight size={18} />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white
                         border-2 border-white/40 hover:border-white hover:bg-white/10
                         transition-all duration-300"
            >
              บริการของเรา
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
