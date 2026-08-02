import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from './components/AuthProvider';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://ecomfind.vercel.app'),

  title: {
    default: 'EcomFind — Shopify Lead Intelligence',
    template: '%s | EcomFind',
  },

  description:
    'Find Shopify stores, audit them with AI, and close deals.',

  alternates: {
    canonical: '/',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },

  openGraph: {
    title: 'EcomFind — Shopify Lead Intelligence',
    description:
      'Find Shopify stores, audit them with AI, and close deals.',
    url: 'https://ecomfind.vercel.app',
    siteName: 'EcomFind',
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'EcomFind — Shopify Lead Intelligence',
    description:
      'Find Shopify stores, audit them with AI, and close deals.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        <AuthProvider>
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}