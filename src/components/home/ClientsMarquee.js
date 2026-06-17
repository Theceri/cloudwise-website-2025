'use client';

import Image from 'next/image';
import Marquee from 'react-fast-marquee';

export function ClientsMarquee() {
  return (
    <section className="border-y border-white/10 bg-ink-800/40 py-10">
      <p className="container-px mb-8 text-center font-mono text-[0.7rem] uppercase tracking-eyebrow text-white/35">
        Trusted by teams &amp; organisations across East Africa
      </p>
      <Marquee speed={36} pauseOnHover gradient gradientColor="#0A0A0B" gradientWidth={120}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div
            key={n}
            className="mx-4 flex h-16 w-40 items-center justify-center rounded-2xl bg-white p-3 opacity-90 shadow-soft transition-opacity duration-300 hover:opacity-100"
          >
            <Image
              src={`/marquee${n}.png`}
              alt={`Client ${n}`}
              width={140}
              height={56}
              className="h-full w-auto object-contain"
            />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
