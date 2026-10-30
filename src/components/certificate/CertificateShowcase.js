import Link from 'next/link';
import { ArrowUpRight, BadgeCheck } from 'lucide-react';

import { Reveal } from '@/components/anim/Reveal';
import { SAMPLE_CODE, sampleCertificate, verifyUrl } from '@/lib/certificate-shared';
import { qrSvg } from '@/lib/qr';
import { CERTIFICATE_POINTS } from '@/lib/training-content';
import { TRACK_KICKSTART } from '@/lib/training';

import { Certificate } from './Certificate';
import { LinkedInPreview } from './LinkedInPreview';

/**
 * The certificate, shown where the course is sold: a sample of the real thing,
 * how it looks on LinkedIn, and what it does for the holder. In Kenya a
 * certificate an employer can check is a large part of why people book.
 */
export async function CertificateShowcase({
  track = TRACK_KICKSTART,
  eyebrow = 'Your certificate',
  title = 'Leave with a certificate employers can check.',
  tone = 'soft',
}) {
  const certificate = sampleCertificate(track);
  const qr = await qrSvg(verifyUrl(SAMPLE_CODE));

  return (
    <section className={`border-t border-white/10 py-16 md:py-28 ${tone === 'ink' ? 'bg-ink' : 'bg-ink-800/30'}`}>
      <div className="container-px">
        <div className="mb-10 max-w-2xl">
          <Reveal as="p" className="eyebrow mb-4">{eyebrow}</Reveal>
          <Reveal as="h2" delay={0.05} className="text-balance font-display text-3xl font-bold text-white md:text-5xl">
            {title}
          </Reveal>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <Reveal>
            <Certificate certificate={certificate} qrSvg={qr} sample />
            <p className="mt-3 text-center text-xs text-white/55">
              A sample. Yours carries your name, your class date and your own certificate code.
            </p>
          </Reveal>

          <div>
            <ul className="space-y-4">
              {CERTIFICATE_POINTS.map(([head, text], i) => (
                <Reveal as="li" key={head} delay={i * 0.04} className="flex gap-3">
                  <BadgeCheck size={20} className="mt-0.5 shrink-0 text-ember" aria-hidden="true" />
                  <span>
                    <strong className="block font-display text-white">{head}</strong>
                    <span className="text-[15px] text-white/70">{text}</span>
                  </span>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={0.12} className="mt-8">
              <LinkedInPreview certificate={certificate} compact />
            </Reveal>
            <Reveal delay={0.16} className="mt-6">
              <Link href="/ai-training/certificate" className="inline-flex items-center gap-2 font-medium text-ember hover:underline">
                See the certificate full size <ArrowUpRight size={16} />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
