import { ExternalLink } from 'lucide-react';

import { CERTIFICATE_ISSUER } from '@/lib/constants';
import { certificateMonth } from '@/lib/certificate-shared';

/**
 * An illustration of the certificate in the "Licenses & certifications"
 * section of a LinkedIn profile, so a buyer can picture it on their own
 * profile. It is drawn here, not a screenshot: LinkedIn's layout changes, and
 * the caption says it is an illustration.
 *
 * The Cloudwise logo appears because the "Add to profile" link names the
 * Cloudwise Technologies company page by its id (src/lib/certificate-shared.js).
 */
export function LinkedInPreview({ certificate, personName, headline = 'Sales and Marketing Officer · Nairobi, Kenya', compact = false }) {
  const name = personName || certificate.name;
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <figure className="m-0">
      <div
        className="overflow-hidden rounded-2xl border border-black/10 bg-[#F4F2EE] text-left text-[#191919] shadow-2xl shadow-black/40"
        style={{ fontFamily: '-apple-system, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
      >
        {!compact && (
          <div className="bg-white">
            <div className="h-16 bg-gradient-to-r from-[#447980] via-[#97D6DF] to-[#447980]" />
            <div className="px-5 pb-4">
              <div className="-mt-9 flex h-[72px] w-[72px] items-center justify-center rounded-full border-4 border-white bg-[#1B1D1B] text-xl font-semibold text-[#FBF7EE]">
                {initials}
              </div>
              <p className="mt-2 text-lg font-semibold leading-tight">{name}</p>
              <p className="text-sm text-black/70">{headline}</p>
            </div>
          </div>
        )}

        <div className={`bg-white px-5 py-4 ${compact ? '' : 'mt-2'}`}>
          <p className="text-[17px] font-semibold">Licenses &amp; certifications</p>
          <div className="mt-3 flex gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[4px] border border-black/10 bg-white p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cloudwise-logo-light.png" alt="" className="h-auto w-full" />
            </div>
            <div className="min-w-0">
              <p className="text-[15px] font-semibold leading-snug">{certificate.courseName}</p>
              <p className="text-sm leading-snug">{CERTIFICATE_ISSUER.name}</p>
              <p className="text-[13px] leading-snug text-black/60">Issued {certificateMonth(certificate)}</p>
              <p className="text-[13px] leading-snug text-black/60">Credential ID {certificate.code}</p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-black/60 px-3.5 py-1 text-sm font-semibold text-black/75">
                Show credential <ExternalLink size={14} aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 text-center text-xs text-white/55">
        Illustration of a LinkedIn profile. One click from your certificate email fills this in.
      </figcaption>
    </figure>
  );
}
