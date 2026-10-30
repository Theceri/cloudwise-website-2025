import Link from 'next/link';
import { ArrowUpRight, Info } from 'lucide-react';

import { Reveal } from '@/components/anim/Reveal';
import { Certificate } from '@/components/certificate/Certificate';
import { LinkedInPreview } from '@/components/certificate/LinkedInPreview';
import { Faq } from '@/components/Faq';
import { StickyBookBar } from '@/components/training/StickyBookBar';
import { CopyBlock } from '@/components/training/CopyBlock';
import { SAMPLE_CODE, cvLine, sampleCertificate, verifyUrl } from '@/lib/certificate-shared';
import { CERTIFICATE_ISSUER, SITE_URL } from '@/lib/constants';
import { qrSvg } from '@/lib/qr';
import { JsonLd, breadcrumbJsonLd } from '@/lib/seo/jsonld';
import { CERTIFICATE_POINTS, NOT_A_JOB } from '@/lib/training-content';
import { PUBLIC_TIERS, TRACKS, TRACK_KICKSTART, formatKes } from '@/lib/training';

export const revalidate = 3600;

export const metadata = {
  title: 'AI Course Certificate in Kenya: See What You Get',
  description:
    'Every Cloudwise AI course ends with a certificate of completion that employers can check online and you can add to LinkedIn in one click. See a sample. Courses from Ksh 500.',
  alternates: { canonical: '/ai-training/certificate' },
  openGraph: {
    type: 'website',
    siteName: 'Cloudwise',
    title: 'The certificate you get from a Cloudwise AI course',
    description: 'Verifiable online, on LinkedIn in one click, from the Ksh 500 Kickstart up.',
    url: `${SITE_URL}/ai-training/certificate`,
    images: [{ url: `/verify/${SAMPLE_CODE}/opengraph-image`, width: 1200, height: 630, alt: 'A sample Cloudwise certificate' }],
  },
  twitter: { card: 'summary_large_image', images: [`/verify/${SAMPLE_CODE}/opengraph-image`] },
};

const kickstart = TRACKS[TRACK_KICKSTART];

const STEPS = [
  ['Attend and do the work', 'Join the full session live and do the exercises with the trainer. The certificate is for people who completed the course, which is what makes it worth showing.'],
  ['Get it by email', 'After the class we email your certificate with its own page on cloudwise.co.ke. Download it as a PDF or print it.'],
  ['Add it to LinkedIn and your CV', 'One click fills in LinkedIn for you, with our logo as the issuer. Paste the ready line into your CV.'],
];

const FAQ = [
  {
    q: 'Which courses give a certificate?',
    a: `All of them. The ${formatKes(kickstart.priceKes)} Kickstart (2 hours), Essentials (4 hours) and the Programme (8 hours) each end with a certificate of completion that states the course and its hours.`,
  },
  {
    q: 'Who gets the certificate?',
    a: 'Everyone who attends the full session and takes part in the exercises. The trainer confirms attendance after the class, and the certificate follows by email.',
  },
  {
    q: 'How does an employer check it?',
    a: 'By scanning the QR code on the certificate, or by entering the certificate code at cloudwise.co.ke/verify. The page shows the name, the course, the hours and the date, and says whether the certificate is valid.',
  },
  {
    q: 'Is it accredited?',
    a: `It is issued by ${CERTIFICATE_ISSUER.legalName}, an ICT company in Westlands, Nairobi, which appears on LinkedIn as ${CERTIFICATE_ISSUER.name}. It is not a university or government qualification. Its value is that it is real and checkable.`,
  },
  {
    q: 'How will my name appear?',
    a: 'Exactly as you type it when you book. Type your name the way it is on your ID.',
  },
  { q: 'Is this course a job? Will I be paid?', a: NOT_A_JOB.long },
];

export default async function CertificatePage() {
  const certificate = sampleCertificate(TRACK_KICKSTART);
  const qr = await qrSvg(verifyUrl(SAMPLE_CODE));

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            ['AI Training', '/ai-training'],
            ['Certificate', '/ai-training/certificate'],
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
          },
        ]}
      />

      <section className="relative overflow-hidden pt-28 pb-12 md:pt-40 md:pb-16">
        <div className="pointer-events-none absolute inset-0 bg-ember-radial" />
        <div className="container-px relative">
          <Reveal as="p" className="eyebrow mb-5">Cloudwise certificates · From {formatKes(kickstart.priceKes)}</Reveal>
          <Reveal as="h1" className="max-w-4xl text-balance font-display text-4xl font-bold leading-[1.04] text-white md:text-6xl">
            The certificate you take to your next interview.
          </Reveal>
          <Reveal as="p" delay={0.08} className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            Every Cloudwise AI course, from the two-hour {formatKes(kickstart.priceKes)} Kickstart up, ends with a
            certificate of completion. It is signed, sealed and checkable online, and it goes on your LinkedIn profile
            in one click. This is exactly what you get.
          </Reveal>
          <Reveal delay={0.12} className="mt-6">
            <p className="inline-flex items-start gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/80">
              <Info size={17} className="mt-0.5 shrink-0 text-ice" aria-hidden="true" /> {NOT_A_JOB.short}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-px">
          <Reveal className="mx-auto max-w-5xl">
            <Certificate certificate={certificate} qrSvg={qr} sample />
            <p className="mt-3 text-center text-sm text-white/55">
              A sample Kickstart certificate. Yours carries your name, your class date and your own code.{' '}
              <Link href={`/verify/${SAMPLE_CODE}`} className="text-ember hover:underline">
                Open its verification page
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/10 bg-ink-800/30 py-16 md:py-28">
        <div className="container-px grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Reveal as="p" className="eyebrow mb-4">On LinkedIn</Reveal>
            <Reveal as="h2" delay={0.05} className="text-balance font-display text-3xl font-bold text-white md:text-5xl">
              Picture it on your profile.
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-6 max-w-lg text-lg leading-relaxed text-white/70">
              Your certificate email has an &ldquo;Add to LinkedIn&rdquo; button. It fills in the course, the issuer,
              the date, the credential ID and the verification link. The issuer is {CERTIFICATE_ISSUER.name}, our
              LinkedIn page, so our logo sits beside your certificate and a recruiter can click through to check it.
            </Reveal>
            <ul className="mt-8 space-y-4">
              {CERTIFICATE_POINTS.map(([head, text]) => (
                <li key={head} className="text-white/75">
                  <strong className="font-display text-white">{head}.</strong> {text}
                </li>
              ))}
            </ul>
          </div>
          <Reveal delay={0.1} className="mx-auto w-full max-w-md">
            <LinkedInPreview certificate={certificate} />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/10 bg-ink py-16 md:py-28">
        <div className="container-px">
          <div className="mb-10 max-w-2xl">
            <Reveal as="p" className="eyebrow mb-4">How you get it</Reveal>
            <Reveal as="h2" delay={0.05} className="text-balance font-display text-3xl font-bold text-white md:text-5xl">
              Three steps, and the first one is two hours.
            </Reveal>
          </div>
          <ol className="grid gap-4 md:grid-cols-3">
            {STEPS.map(([head, text], i) => (
              <Reveal as="li" key={head} delay={i * 0.05} className="card-dark p-6">
                <span className="font-mono text-sm text-ember">0{i + 1}</span>
                <h3 className="mt-2 font-display text-xl font-semibold text-white">{head}</h3>
                <p className="mt-2 text-white/70">{text}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.1} className="mt-10 max-w-2xl">
            <p className="eyebrow mb-3">The line for your CV looks like this</p>
            <CopyBlock text={cvLine(certificate)} label="Copy" kicker="Certifications" />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-white/10 bg-ink-800/30 py-16 md:py-28">
        <div className="container-px">
          <div className="mb-10 max-w-2xl">
            <Reveal as="p" className="eyebrow mb-4">Courses</Reveal>
            <Reveal as="h2" delay={0.05} className="text-balance font-display text-3xl font-bold text-white md:text-5xl">
              Every course ends with a certificate.
            </Reveal>
          </div>
          <div className="card-dark overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <caption className="sr-only">Courses, hours, prices and certificates</caption>
              <thead className="bg-white/[0.04]">
                <tr>
                  {['Course', 'Hours', 'Price', 'Certificate', ''].map((h) => (
                    <th key={h} scope="col" className="p-4 font-medium text-white/65">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PUBLIC_TIERS.map((id) => {
                  const t = TRACKS[id];
                  return (
                    <tr key={id} className="border-t border-white/10">
                      <th scope="row" className="p-4 font-medium text-white">{t.name}</th>
                      <td className="p-4 text-white/75">{t.certificate.hours}</td>
                      <td className="p-4 text-white/75">{formatKes(t.priceKes)}</td>
                      <td className="p-4 text-white/75">Completion</td>
                      <td className="p-4">
                        <Link href={t.landingPath} className="text-ember hover:underline">
                          See the course
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Faq items={FAQ} eyebrow="FAQ" title="Certificates, answered" />

      <section className="relative overflow-hidden border-t border-white/10 bg-ink py-16 md:py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[55rem] -translate-x-1/2 rounded-full bg-ember/15 blur-3xl" />
        <div className="container-px relative text-center">
          <Reveal as="h2" className="mx-auto max-w-3xl text-balance font-display text-4xl font-bold text-white md:text-6xl">
            Your first certificate is two hours away.
          </Reveal>
          <Reveal as="p" delay={0.08} className="mx-auto mt-6 max-w-xl text-lg text-white/65">
            AI Kickstart, live on Google Meet, Wednesdays 7:00 to 9:00pm. {formatKes(kickstart.priceKes)}.
          </Reveal>
          <Reveal delay={0.14} className="mt-9 flex justify-center">
            <Link href={kickstart.landingPath} className="btn-ember text-base">
              See the Kickstart <ArrowUpRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      <StickyBookBar href={kickstart.registerPath} label={`Book for ${formatKes(kickstart.priceKes)}`} />
    </>
  );
}
