'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const CloudField = dynamic(() => import('./CloudField'), { ssr: false });

export function HeroCanvas({ className = '' }) {
  const [enabled, setEnabled] = useState(false);
  const [density, setDensity] = useState(1);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    // lighter cloud on small / low-power screens
    const small = window.innerWidth < 768;
    setDensity(small ? 0.5 : 1);
    setEnabled(true);
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
