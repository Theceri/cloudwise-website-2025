import './globals.css';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { SiteChrome } from '@/components/SiteChrome';
import { MetaPixel } from '@/components/MetaPixel';
import { GoogleTag } from '@/components/GoogleTag';
import { MicrosoftClarity } from '@/components/MicrosoftClarity';
import { THEME_INIT_SCRIPT } from '@/lib/theme';
import { SITE_URL } from '@/lib/constants';
import { JsonLd, organizationJsonLd, websiteJsonLd } from '@/lib/seo/jsonld';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Cloudwise — AI, Software & Digital Transformation in Nairobi',
    template: '%s · Cloudwise',
  },
  description:
    'Cloudwise is a Nairobi-based ICT company building AI products, web & mobile apps, and running hands-on AI productivity training for businesses across East Africa.',
  keywords: [
    'Cloudwise', 'AI development Kenya', 'AI training Nairobi', 'software development Kenya',
    'web development Nairobi', 'mobile app development', 'digital transformation', 'AI agents',
    'AI productivity training', 'ICT company Kenya',
  ],
  authors: [{ name: 'Cloudwise' }],
  creator: 'Cloudwise',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: SITE_URL,
    siteName: 'Cloudwise',
    title: 'Cloudwise — AI, Software & Digital Transformation',
    description:
      'We build intelligent products and train teams to work smarter with AI. Nairobi-based, serving East Africa.',
    images: [{ url: '/dt-banner-5.png', width: 1200, height: 630, alt: 'Cloudwise' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cloudwise — AI, Software & Digital Transformation',
    description: 'We build intelligent products and train teams to work smarter with AI.',
    images: ['/dt-banner-5.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  icons: { icon: '/icon.png' },
};

export const viewport = {
  themeColor: '#0A0A0B',
  width: 'device-width',
  initialScale: 1,
};

// The company and the site, on every page. Built in src/lib/seo/jsonld.js so
// every page's markup points at the same @id.
const siteJsonLd = [organizationJsonLd(), websiteJsonLd()];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies a saved light-theme choice before the first paint. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="bg-ink text-white/90 antialiased">
        <JsonLd data={siteJsonLd} />
        <MetaPixel />
        <GoogleTag />
        <MicrosoftClarity />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
