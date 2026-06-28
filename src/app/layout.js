import './globals.css';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { SiteChrome } from '@/components/SiteChrome';
import { SITE_URL, COMPANY_INFO, SOCIAL_LINKS } from '@/lib/constants';

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

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: COMPANY_INFO.legalName,
  alternateName: 'Cloudwise',
  url: SITE_URL,
  logo: `${SITE_URL}/logo1.png`,
  email: COMPANY_INFO.email,
  telephone: COMPANY_INFO.phoneRaw,
  foundingDate: COMPANY_INFO.founded,
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${COMPANY_INFO.address.line1}, ${COMPANY_INFO.address.line2}`,
    addressLocality: COMPANY_INFO.address.city,
    addressCountry: 'KE',
  },
  sameAs: SOCIAL_LINKS.map((s) => s.href),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="bg-ink text-white/90 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
