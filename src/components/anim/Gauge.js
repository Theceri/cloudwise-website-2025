'use client';

import { useEffect, useRef } from 'react';

/**
 * The Cloudwise speedometer motif — a dotted gauge arc with a sweeping needle.
 * Purely decorative; echoes the logo + the marketing flier.
 */
export function Gauge({ size = 220, className = '', accent = '#FF3F1A' }) {
  const needleRef = useRef(null);

  useEffect(() => {
    const needle = needleRef.current;
    if (!needle) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      needle.style.transform = 'rotate(28deg)';
      return;
    }
    let raf;
    const start = performance.now();
    const loop = (now) => {
      const t = (now - start) / 1000;
      // gentle oscillation between -50deg and +50deg
      const angle = Math.sin(t * 0.6) * 50;
      needle.style.transform = `rotate(${angle}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const cx = 100;
  const cy = 100;
  const ticks = Array.from({ length: 28 });

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      {/* dotted ring */}
      {ticks.map((_, i) => {
        const a = (-220 + (i / (ticks.length - 1)) * 260) * (Math.PI / 180);
        const r1 = 86;
        const x1 = cx + Math.cos(a) * r1;
        const y1 = cy + Math.sin(a) * r1;
        return <circle key={i} cx={x1} cy={y1} r={1.5} fill={accent} opacity={0.35} />;
      })}
      {/* arc */}
      <path
        d="M 28 130 A 80 80 0 1 1 172 130"
        fill="none"
        stroke={accent}
        strokeOpacity="0.25"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* hub */}
      <circle cx={cx} cy={cy} r="6" fill={accent} />
      <circle cx={cx} cy={cy} r="11" fill="none" stroke={accent} strokeOpacity="0.4" />
      {/* needle */}
      <g ref={needleRef} style={{ transformOrigin: '100px 100px', transition: 'transform 0.2s linear' }}>
        <line x1={cx} y1={cy} x2={cx} y2="36" stroke={accent} strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}
