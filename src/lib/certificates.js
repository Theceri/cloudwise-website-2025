import 'server-only';

import { SITE_URL } from '@/lib/constants';
import { claimOnce, releaseClaim } from '@/lib/store';
import { TRACKS, TRACK_ESSENTIALS, TRACK_PROGRAMME, endDateFor } from '@/lib/training';
import { writeClient } from '@/sanity/lib/writeClient';

/**
 * Certificates with a verification code (tiered plan rev5, §7).
 *
 *   Programme   certificate of completion (both Saturdays)
 *   Essentials  certificate of attendance
 *   Kickstart   none
 *
 * A Programme booking paid with an Essentials credit (Day Two only) completes
 * the Programme, so it gets a certificate of completion too.
 */

const CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export const certificateId = (code) => `certificate.${code}`;

function newCode() {
  const bytes = new Uint8Array(8);
  globalThis.crypto.getRandomValues(bytes);
  return `CW-${Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')}`;
}

export function certificateKindFor(track) {
  if (track === TRACK_PROGRAMME) return 'completion';
  if (track === TRACK_ESSENTIALS) return 'attendance';
  return null;
}

export const verifyUrl = (code) => `${SITE_URL}/verify/${code}`;

/** LinkedIn's "Add to profile" link, prefilled with this certificate. */
export function linkedInAddUrl(certificate) {
  const date = new Date(`${certificate.classDate || certificate.issuedAt?.slice(0, 10)}T00:00:00Z`);
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: certificate.courseName,
    organizationName: 'Cloudwise Limited',
    issueYear: String(date.getUTCFullYear()),
    issueMonth: String(date.getUTCMonth() + 1),
    certId: certificate.code,
    certUrl: verifyUrl(certificate.code),
  });
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

export async function getCertificate(code) {
  if (!/^CW-[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{8}$/.test(String(code || ''))) return null;
  return writeClient.getDocument(certificateId(code));
}

export async function certificateFor(reference) {
  return writeClient.fetch(
    `*[_type == "trainingCertificate" && registrationRef == $reference && revoked != true][0]`,
    { reference },
    { cache: 'no-store' }
  );
}

/**
 * Issue the certificate for one paid booking, exactly once. Returns
 * { issued, certificate } or { issued: false, reason }.
 */
export async function issueCertificate(registration) {
  const kind = certificateKindFor(registration?.track);
  if (!kind) return { issued: false, reason: 'this course has no certificate' };
  if (registration.status !== 'paid') return { issued: false, reason: 'booking is not paid' };

  const claim = `certificate.${registration.reference}`;
  if (!(await claimOnce(claim))) {
    return { issued: false, reason: 'already issued', certificate: await certificateFor(registration.reference) };
  }

  const code = newCode();
  const doc = {
    _id: certificateId(code),
    _type: 'trainingCertificate',
    code,
    name: [registration.firstName, registration.lastName].filter(Boolean).join(' '),
    kind,
    track: registration.track,
    courseName: TRACKS[registration.track]?.name || 'AI training',
    classDate: endDateFor({ track: registration.track, cohortId: registration.cohortId, attendsDays: registration.attendsDays }),
    registrationRef: registration.reference,
    issuedAt: new Date().toISOString(),
    revoked: false,
  };

  try {
    const certificate = await writeClient.create(doc);
    return { issued: true, certificate };
  } catch (err) {
    await releaseClaim(claim);
    throw err;
  }
}
