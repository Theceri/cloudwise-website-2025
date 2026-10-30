import Link from 'next/link';
import { BadgeCheck, Linkedin, XCircle } from 'lucide-react';

import { Certificate } from '@/components/certificate/Certificate';
import { PrintButton } from '@/components/certificate/PrintButton';
import { CopyBlock } from '@/components/training/CopyBlock';
import { getCertificate } from '@/lib/certificates';
import {
  SAMPLE_CODE,
  certificateCourse,
  certificateDate,
  certificateKindLabel,
  cvLine,
  linkedInAddUrl,
  sampleCertificate,
  verifyUrl,
} from '@/lib/certificate-shared';
import { CERTIFICATE_ISSUER } from '@/lib/constants';
import { qrSvg } from '@/lib/qr';

export const dynamic = 'force-dynamic';

function normalise(raw) {
  return String(raw || '').toUpperCase();
}

async function load(code) {
  if (code === SAMPLE_CODE) return sampleCertificate();
  return getCertificate(code).catch(() => null);
}

export async function generateMetadata({ params }) {
  const code = normalise((await params).code);
  const certificate = await load(code);
  const valid = certificate && !certificate.revoked;
  const title = valid
    ? `${certificate.name}: ${certificate.courseName} certificate`
    : 'Verify a certificate';
  return {
    title,
    description: valid
      ? `${certificateKindLabel(certificate.kind)} issued by ${CERTIFICATE_ISSUER.name} (${CERTIFICATE_ISSUER.legalName}), Nairobi. Certificate ID ${certificate.code}.`
      : 'Check a Cloudwise training certificate by its code.',
    // Personal records: never indexed. They are still shared on LinkedIn and
    // WhatsApp, so the share card (opengraph-image.js) shows the certificate.
    robots: { index: false, follow: false },
  };
}

/**
 * A certificate's own page. Anyone with the code, an employer for example,
 * sees that it is genuine, and sees the certificate itself. The holder can
 * download it, add it to LinkedIn and copy a line for their CV.
 *
 * Only the name, the course and the date are shown. Nothing else about the
 * person is on this page.
 */
export default async function VerifyPage({ params }) {
  const code = normalise((await params).code);
  const certificate = await load(code);
  const valid = Boolean(certificate && !certificate.revoked);
  const isSample = code === SAMPLE_CODE;

  if (!certificate) return <NotFound code={code} />;
  if (!valid) return <Revoked certificate={certificate} />;

  const qr = await qrSvg(verifyUrl(certificate.code));
  const course = certificateCourse(certificate);

  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36">
      <div className="pointer-events-none absolute inset-0 bg-ember-radial" />
      <div className="container-px relative">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-ice/30 bg-ice/[0.07] p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
            <BadgeCheck size={30} className="shrink-0 text-ice" aria-hidden="true" />
            <div>
              <h1 className="font-display text-xl font-bold text-white md:text-2xl">
                {isSample ? 'This is a sample certificate' : 'Verified: this certificate is genuine'}
              </h1>
              <p className="mt-1 text-sm text-white/70">
                {isSample
                  ? 'It shows what a Cloudwise certificate looks like. Real certificates have their own code and page like this one.'
                  : `Issued by ${CERTIFICATE_ISSUER.name} (${CERTIFICATE_ISSUER.legalName}), Nairobi, to ${certificate.name} for ${course.name}${course.hours ? `, ${course.hours} hours` : ''}, on ${certificateDate(certificate)}.`}
              </p>
            </div>
          </div>

          <Certificate certificate={certificate} qrSvg={qr} sample={isSample} />

          {!isSample && (
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
              <div className="card-dark p-6">
                <p className="eyebrow mb-3">Is this your certificate?</p>
                <div className="flex flex-col gap-3">
                  <PrintButton className="w-full justify-center" />
                  <a
                    href={linkedInAddUrl(certificate)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost w-full justify-center text-base"
                  >
                    <Linkedin size={18} /> Add to my LinkedIn profile
                  </a>
                </div>
                <p className="mt-4 text-sm text-white/65">
                  To save a PDF, choose <strong className="text-white">Save as PDF</strong> as the printer. LinkedIn
                  fills in the course, the issuer, the date and this page&apos;s link for you.
                </p>
              </div>
              <div>
                <p className="eyebrow mb-3">For your CV</p>
                <CopyBlock text={cvLine(certificate)} label="Copy" kicker="Paste under Certifications" />
                <dl className="mt-5 space-y-2 text-sm">
                  <Row label="Awarded to" value={certificate.name} />
                  <Row label="Course" value={`${course.name}${course.hours ? ` · ${course.hours} hours` : ''}`} />
                  <Row label="Type" value={certificateKindLabel(certificate.kind)} />
                  <Row label="Completed on" value={certificateDate(certificate)} />
                  <Row label="Certificate ID" value={certificate.code} />
                </dl>
              </div>
            </div>
          )}

          <p className="mt-10 text-center text-sm text-white/65">
            <Link href="/ai-training/certificate" className="text-ember hover:underline">
              About Cloudwise certificates and the AI courses
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

function NotFound({ code }) {
  return (
    <Notice
      icon={<XCircle size={28} />}
      eyebrow={`Certificate check · ${code}`}
      title="No certificate with this code"
      text="Check the code on the certificate and try again. Codes look like CW-7K3M9P2X."
    />
  );
}

function Revoked({ certificate }) {
  return (
    <Notice
      icon={<XCircle size={28} />}
      eyebrow={`Certificate check · ${certificate.code}`}
      title="This certificate was revoked"
      text={`A certificate with this code was issued to ${certificate.name} for ${certificate.courseName} and later cancelled by Cloudwise. It is not valid.`}
    />
  );
}

function Notice({ icon, eyebrow, title, text }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-44">
      <div className="pointer-events-none absolute inset-0 bg-ember-radial" />
      <div className="container-px relative">
        <div className="card-dark mx-auto max-w-lg p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white/70">
            {icon}
          </div>
          <p className="eyebrow mt-5">{eyebrow}</p>
          <h1 className="mt-3 font-display text-2xl font-bold text-white">{title}</h1>
          <p className="mt-3 text-white/65">{text}</p>
          <p className="mt-8 text-sm">
            <Link href="/verify" className="text-ember hover:underline">
              Check another code
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] pb-2">
      <dt className="text-white/65">{label}</dt>
      <dd className="text-right font-medium text-white">{value}</dd>
    </div>
  );
}
