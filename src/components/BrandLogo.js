'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * Cloudwise wordmark — the official rebrand lockup (cloud + speedometer badge
 * over the "Cloudwise" wordmark). Renders from the transparent PNG so it stays
 * crisp on the dark canvas and over the translucent navbar.
 */
export function BrandLogo({ className = '', priority = false }) {
  return (
    <Image
      src="/cloudwise-logo.png"
      alt="Cloudwise"
      width={478}
      height={254}
      priority={priority}
      // Shown 44px tall, so about 83px wide. Without `sizes`, Next.js offered
      // the browser a 1,080px-wide file for it.
      sizes="96px"
      className={cn('h-11 w-auto', className)}
    />
  );
}
