import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Zekât Araştırmaları - İslami Finans ve Zekât Konularında Akademik Çalışmalar',
  description: 'İslami finans ve zekât konularında akademik çalışmalara erişim platformu. Zekât araştırmaları, İslami ekonomi ve finans konularında kapsamlı kaynaklara ulaşın.',
  keywords: 'zekât, İslami finans, İslami ekonomi, akademik araştırma, zekât hesaplama, İslami bankacılık',
  authors: [{ name: 'Zekât Araştırmaları Platformu' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#10B981',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}