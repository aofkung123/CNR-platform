/**
 * CNR Platform — Brand Theme Configuration
 *
 * Each brand in the CNR group gets its own color palette and metadata.
 * These values are injected as CSS variables via the layout's data-brand attribute,
 * allowing Tailwind's `brand-*` tokens to adapt per-page automatically.
 */

export type BrandKey = 'cnr_group' | 'cac_audit' | 'nr_accounting' | 'nr_advisory' | 'model_mix';

export interface BrandConfig {
  key: BrandKey;
  name: string;           // Display name
  nameTh: string;         // Thai name
  tagline: string;
  logoSrc: string;        // Path in /public
  lineQrSrc: string;      // Line QR Code path
  colors: {
    primary: string;      // Main brand color (hex)
    primaryLight: string; // Lighter tint
    primaryDark: string;  // Darker shade
    accent: string;       // Highlight / CTA color
  };
  contact: {
    phone: string;
    email: string;
    lineId: string;
    address: string;
    facebook: string;
    instagram?: string;
  };
  mapEmbedUrl: string;
  routes: {
    path: string;          // Next.js route path
    externalUrl?: string;  // Original website URL
  };
}

export const BRANDS: Record<BrandKey, BrandConfig> = {
  cnr_group: {
    key: 'cnr_group',
    name: 'CNR Group',
    nameTh: 'กลุ่มบริษัท CNR',
    tagline: 'บริการบัญชี ภาษี ตรวจสอบบัญชี ครบวงจร',
    logoSrc: '/logos/logo-CNRgroup.png',
    lineQrSrc: '/images/shared/line@cnr.jpg',
    colors: {
      primary: '#1B6B3A',      // Deep green
      primaryLight: '#2E9959',
      primaryDark: '#114828',
      accent: '#F59E0B',       // Amber gold
    },
    contact: {
      phone: '084-282-4440',
      email: 'admin@cnrgroupcompany.com',
      lineId: '@cnrgroup',
      address: 'Park Silom Building ชั้น 14 ห้อง 1406 ถนนคอนแวนต์ แขวงสีลม เขตบางรัก กรุงเทพฯ 10500',
      facebook: 'https://www.facebook.com/CNRGroupCompany',
      instagram: 'https://www.instagram.com/cnrgroup.th/',
    },
    mapEmbedUrl: 'https://www.google.com/maps?q=CNR+Group+Company+Bangkok&output=embed',
    routes: {
      path: '/',
      externalUrl: 'https://cnrgroupcompany.com',
    },
  },

  cac_audit: {
    key: 'cac_audit',
    name: 'CAC Audit',
    nameTh: 'บริการตรวจสอบบัญชี',
    tagline: 'ตรวจสอบบัญชีมืออาชีพ มาตรฐานสากล',
    logoSrc: '/logos/cac.png',
    lineQrSrc: '/images/shared/line@cnr.jpg',
    colors: {
      primary: '#1E5FA8',      // Deep blue
      primaryLight: '#2D7DD2',
      primaryDark: '#154080',
      accent: '#F97316',       // Orange
    },
    contact: {
      phone: '084-282-4440',
      email: 'admin@cac-audit.com',
      lineId: '@cac-audit',
      address: 'Park Silom Building ชั้น 14 ห้อง 1406 ถนนคอนแวนต์ แขวงสีลม เขตบางรัก กรุงเทพฯ 10500',
      facebook: 'https://www.facebook.com/CNRGroupCompany',
    },
    mapEmbedUrl: 'https://www.google.com/maps?q=CAC+Audit+Bangkok&output=embed',
    routes: {
      path: '/audit',
      externalUrl: 'https://cac-audit.com',
    },
  },

  nr_accounting: {
    key: 'nr_accounting',
    name: 'NR Group Accounting',
    nameTh: 'บริการรับทำบัญชี',
    tagline: 'บริการทำบัญชีครบวงจร โดยผู้เชี่ยวชาญ',
    logoSrc: '/logos/accounting.png',
    lineQrSrc: '/images/shared/line@cnr.jpg',
    colors: {
      primary: '#1B6B3A',      // Green (same as CNR Group)
      primaryLight: '#2E9959',
      primaryDark: '#114828',
      accent: '#10B981',       // Emerald
    },
    contact: {
      phone: '084-282-4440',
      email: 'admin@nrgroupaccounting.com',
      lineId: '@nraccounting',
      address: 'Park Silom Building ชั้น 14 ห้อง 1406 ถนนคอนแวนต์ แขวงสีลม เขตบางรัก กรุงเทพฯ 10500',
      facebook: 'https://www.facebook.com/nrgroupaccounting',
    },
    mapEmbedUrl: 'https://www.google.com/maps?q=NR+Group+Accounting+Bangkok&output=embed',
    routes: {
      path: '/accounting',
      externalUrl: 'https://nrgroupaccounting.com',
    },
  },

  nr_advisory: {
    key: 'nr_advisory',
    name: 'NR Group Advisory',
    nameTh: 'ที่ปรึกษาด้านบัญชี ภาษี และกฎหมาย',
    tagline: 'ที่ปรึกษาธุรกิจมืออาชีพ ครบทุกมิติ',
    logoSrc: '/logos/nrgroup.png',
    lineQrSrc: '/images/shared/line@cnr.jpg',
    colors: {
      primary: '#3478AD',      // Corporate blue
      primaryLight: '#4A9BD4',
      primaryDark: '#235A8A',
      accent: '#F59E0B',       // Gold
    },
    contact: {
      phone: '084-282-4440',
      email: 'admin@nrgroupadvisory.com',
      lineId: '@nradvisory',
      address: 'Park Silom Building ชั้น 14 ห้อง 1406 ถนนคอนแวนต์ แขวงสีลม เขตบางรัก กรุงเทพฯ 10500',
      facebook: 'https://www.facebook.com/CNRGroupCompany',
      instagram: 'https://www.instagram.com/nrgroupadvisory/',
    },
    mapEmbedUrl: 'https://www.google.com/maps?q=NR+Group+Advisory+Bangkok&output=embed',
    routes: {
      path: '/advisory',
      externalUrl: 'https://nrgroupadvisory.com',
    },
  },

  model_mix: {
    key: 'model_mix',
    name: 'Model Mix',
    nameTh: 'บริษัท โมเดล มิกซ์ จำกัด',
    tagline: 'บริการจัดอบรมสัมมนาด้านบัญชี-ภาษี และธุรกิจ',
    logoSrc: '/logos/modelmix.png',
    lineQrSrc: '/images/shared/line@cnr.jpg',
    colors: {
      primary: '#CD5420',      // Deep orange from converted project
      primaryLight: '#e07a3f',
      primaryDark: '#a14118',
      accent: '#CD5420',
    },
    contact: {
      phone: '084-282-4440',
      email: 'admin@cnrgroupcompany.com',
      lineId: '@cnrgroup',
      address: 'Park Silom Building ชั้น 14 ห้อง 1406 ถนนคอนแวนต์ แขวงสีลม เขตบางรัก กรุงเทพฯ 10500',
      facebook: 'https://www.facebook.com/CNRGroupCompany',
      instagram: 'https://www.instagram.com/cnrgroup.th/',
    },
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.8444475892184!2d100.53095817455838!3d13.727865797848304!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29f80e817ad99%3A0x56be77ea713b9096!2sCNR%20Group%20%3A%20Financial%20Solution%20Services%20(Professional%20Accounting%20%26%20Tax)!5e0!3m2!1sth!2sus!4v1776853775073!5m2!1sth!2sus',
    routes: {
      path: '/modelmix',
    },
  },
};
