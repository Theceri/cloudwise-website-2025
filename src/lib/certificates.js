import 'server-only';

import { writeClient } from '@/sanity/lib/writeClient';
import { claimOnce, releaseClaim } from '@/lib/store';
import { TRACKS, endDateFor } from '@/lib/training';

import { certificateKindFor } from './certificate-shared';

export { CERTIFICATE_TRACKS, certificateKindFor, certificateKindLabel, linkedInAddUrl, verifyUrl } from './certificate-shared';

/**
 * Certificates with a verification code.
 *
 * Every paid course earns a certificate of completion, issued from the Studio
 * after the class to the people who attended (decided 30 October 2026, when
 * the offer moved to selling the certificate): the Kickstart for its two
 * hours, Essentials for its four, the Programme for its eight. Certificates
 * issued before that date keep the kind they were issued with.
 *
 * A Programme booking paid with an Essentials credit (Day Two only) completes
 * the Programme, so it gets the Programme certificate.
 */

const CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

export const certificateId = (code) => `certificate.${code}`;

function newCode() {
  const bytes = new Uint8Array(8);
  globalThis.crypto.getRandomValues(bytes);
  return `CW-${Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')}`;
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
