import { Plus_Jakarta_Sans, Cinzel } from 'next/font/google';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata = {
  title: 'Kadapa Black Stone Catalog & Ordering Portal | Transport AI',
  description: 'Authentic quarry-direct Kadapa natural black stone in 2x2 and 3x3 formats, 30mm/40mm/50mm thickness. Live truck load calculator and direct WhatsApp ordering.',
  keywords: 'Kadapa black stone, natural stone paving, 2x2 stone rates, 3x3 stone slabs, rough cleft limestone, polished black stone, Transport AI',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#081812',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${cinzel.variable}`}>
      <body>{children}</body>
    </html>
  );
}
