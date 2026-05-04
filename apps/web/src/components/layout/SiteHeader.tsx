'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import type { BrandConfig } from '@/config/brands';

interface SiteHeaderProps {
  brand: BrandConfig;
}

const NAV_LINKS = [
  { href: '#history', label: 'ประวัติ' },
  { href: '#services', label: 'บริการ' },
  { href: '#testimonial', label: 'รีวิว' },
  { href: '#awards', label: 'รางวัล' },
  { href: '#news', label: 'ความรู้/ข่าวสาร' },
  { href: '#map', label: 'แผนที่' },
  { href: '#contact', label: 'ติดต่อ' },
];

export function SiteHeader({ brand }: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`site-header ${scrolled ? 'scrolled' : ''}`}
      id="top"
    >
      <div className="cnr-container flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0" aria-label={brand.name}>
          <Image
            src={brand.logoSrc}
            alt={brand.name}
            width={220}
            height={72}
            className="h-16 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="เมนูหลัก">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-[var(--foreground)] hover:bg-[var(--section-bg)]"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav
          className="md:hidden border-t border-[var(--border)] bg-white px-4 pb-4 pt-2 flex flex-col gap-1"
          aria-label="เมนูมือถือ"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link block py-2"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
