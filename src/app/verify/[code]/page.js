import Link from 'next/link';
import { CheckCircle2, XCircle } from 'lucide-react';

import { getCertificate } from '@/lib/certificates';
import { formatDay } from '@/lib/training';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Verify a certificate',
  // Personal records: never indexed.
  robots: { index: false, follow: false },
};

/**
 * Anyone with a certificate code can check it here: the name, the course, the
 * date, and whether it is valid or revoked. Nothing else about the person is
 * shown.
 */
export default async function VerifyPage({ params }) {
  const { code: raw } = await params;
  const code = String(raw || '').toUpperCase();
  const certificate = await getCertificate(code).catch(() => null);
  const valid = certificate && !certificate.revoked;

  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-44">
      <div className="pointer-events-none absolute inset-0 bg-ember-radial" />
      <div className="container-px relative">
        <div className="card-dark mx-auto max-w-lg p-8 text-center">
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${valid ? 'bg-ember/15 text-ember' : 'bg-white/10 text-white/70'}`}
          >
            {valid ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
          </div>
          <p className="eyebrow mt-5">Certificate check · {code}</p>

          {!certificate && (
            <>
              <h1 className="mt-3 font-display text-2xl font-bold text-white">No certificate with this code</h1>
              <p className="mt-3 text-white/65">Check the code on the certificate and try again.</p>
            </>
          )}

          {certificate && (
            <>
              <h1 className="mt-3 font-display text-2xl font-bold text-white">
                {valid ? 'Valid certificate' : 'This certificate was revoked'}
              </h1>
              <dl className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm">
                <Row label="Awarded to" value={certificate.name} />
                <Row label="Course" value={certificate.courseName} />
                <Row
                  label="Type"
                  value={certificate.kind === 'completion' ? 'Certificate of completion' : 'Certificate of attendance'}
                />
                {certificate.classDate && <Row label="Completed on" value={formatDay(certificate.classDate, { long: true })} />}
                <Row label="Issued by" value="Cloudwise Limited, Nairobi" />
              </dl>
            </>
          )}

          <p className="mt-8 text-sm text-white/65">
            <Link href="/ai-training" className="text-ember hover:underline">
              About the Cloudwise AI training
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
