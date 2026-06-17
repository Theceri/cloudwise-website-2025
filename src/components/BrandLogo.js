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
      className={cn('h-11 w-auto', className)}
    />
  );
}
