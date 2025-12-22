import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Find Trusted HVAC & Plumbing Pros | Georgia Home Services',
    template: '%s | Georgia Home Services',
  },
  description:
    'Connect with licensed, vetted HVAC and plumbing professionals in Georgia. Get free quotes for AC repair, heating, plumbing emergencies, and more.',
  keywords: [
    'HVAC repair',
    'plumber near me',
    'AC repair Georgia',
    'emergency plumber',
    'heating repair Atlanta',
    'air conditioning installation',
  ],
  authors: [{ name: 'Georgia Home Services' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Georgia Home Services',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-white font-sans">
        {children}
      </body>
    </html>
  );
}
