'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const CloudField = dynamic(() => import('./CloudField'), { ssr: false });

export function HeroCanvas({ className = '' }) {
  const [enabled, setEnabled] = useState(false);
  const [density, setDensity] = useState(1);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return undefined;
    // Phones and tablets keep the CSS glow below. Three.js is the heaviest
    // code on the site, and on a phone it competed with the first paint
    // (traces of 14 October 2026). Large screens with a mouse get the
    // canvas, mounted once the browser is idle so it never delays the hero.
    if (!window.matchMedia('(min-width: 768px) and (pointer: fine)').matches) return undefined;

    setDensity(1);
    const start = () => setEnabled(true);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 800);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className={className} aria-hidden="true">
      {/* CSS fallback glow — always present, sits behind the canvas */}
      <div className="absolute inset-0 bg-ember-radial" />
      {enabled && (
        <div className="absolute inset-0">
          <CloudField density={density} />
        </div>
      )}
    </div>
  );
}
