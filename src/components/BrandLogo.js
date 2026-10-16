'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Cloudwise wordmark — the official rebrand lockup (cloud + speedometer badge
 * over the "Cloudwise" wordmark). Renders from the transparent PNG so it stays
 * crisp on the dark canvas and over the translucent navbar.
 */
export function BrandLogo({ className = '', priority = false }) {
  const shared = {
    alt: 'Cloudwise',
    width: 478,
    height: 254,
    // Shown 44px tall, so about 83px wide. Without `sizes`, Next.js offered
    // the browser a 1,080px-wide file for it.
    sizes: '96px',
  };
  // Two files: the white wordmark for the dark theme and a dark wordmark for
  // the optional light theme. CSS in globals.css shows the right one; the
  // hidden one is display:none, so screen readers announce only one.
  return (
    <>
      <Image {...shared} src="/cloudwise-logo.png" priority={priority} className={cn('logo-on-dark h-11 w-auto', className)} />
      <Image
        {...shared}
        src="/cloudwise-logo-light.png"
        loading="eager"
        className={cn('logo-on-light h-11 w-auto', className)}
      />
    </>
  );
}
