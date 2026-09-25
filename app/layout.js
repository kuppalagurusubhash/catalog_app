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
  title: 'KADAPA STONE TRANSPORT | Kerala Direct Supply & 16-Wheeler Transit',
  description: 'Official Kadapa Stone Transport direct quarry supply to Kerala. 20+ heavy 16-wheeler fleet, 200+ clients across 7 delivery hubs since 2002.',
  keywords: 'Kadapa black stone, Kadapa Stone Transport, Kerala stone supply, 2x2 stone rates, 16 wheeler lorry stone transit, natural limestone Kerala',
  icons: {
    icon: '/logo-icon.png',
    apple: '/logo-icon.png',
  },
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
