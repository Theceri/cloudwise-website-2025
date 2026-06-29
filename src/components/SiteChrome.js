'use client';

import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { SmoothScroll } from '@/components/SmoothScroll';

/**
 * Wraps the app in the site chrome (smooth-scroll, navbar, footer, toaster,
 * floating WhatsApp button) — EXCEPT on /studio, where the embedded Sanity
 * Studio must render full-screen without Lenis smooth-scroll or a fixed navbar.
 */
export function SiteChrome({ children }) {
  const pathname = usePathname();

  if (pathname?.startsWith('/studio')) {
    return children;
  }

  return (
    <>
      <SmoothScroll>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </SmoothScroll>
      <Toaster position="top-right" theme="dark" richColors />
      <WhatsAppButton phoneNumber="+254712658775" />
    </>
  );
}
