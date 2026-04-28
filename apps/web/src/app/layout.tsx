import type { Metadata } from 'next';
import { Prompt } from 'next/font/google';
import './globals.css';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-prompt',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'CNR Group — บริการบัญชี ภาษี ตรวจสอบบัญชี ครบวงจร',
    template: '%s | CNR Group',
  },
  description: 'CNR GROUP ผู้ให้บริการด้านบัญชี ภาษี ตรวจสอบบัญชี วางระบบควบคุมภายใน และที่ปรึกษาธุรกิจอย่างมืออาชีพ',
  keywords: ['บัญชี', 'ภาษี', 'ตรวจสอบบัญชี', 'CNR Group', 'ที่ปรึกษาธุรกิจ'],
  openGraph: {
    type: 'website',
    locale: 'th_TH',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" data-brand="cnr_group" className={prompt.variable}>
      <body>{children}</body>
    </html>
  );
}
