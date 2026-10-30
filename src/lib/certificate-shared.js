import { CERTIFICATE_ISSUER, SITE_URL } from '@/lib/constants';
import { TRACKS, TRACK_ESSENTIALS, TRACK_KICKSTART, TRACK_PROGRAMME, formatDay } from '@/lib/training';

/**
 * The parts of a certificate that pages, emails and the Studio all read. Pure
 * functions, no Sanity, so the sample on /ai-training/certificate and the real
 * one on /verify/<code> are drawn from the same words.
 */

/** Courses that earn a certificate. The Studio buttons read this list too. */
export const CERTIFICATE_TRACKS = [TRACK_KICKSTART, TRACK_ESSENTIALS, TRACK_PROGRAMME];

export function certificateKindFor(track) {
  return CERTIFICATE_TRACKS.includes(track) ? 'completion' : null;
}

export function certificateKindLabel(kind) {
  return kind === 'attendance' ? 'Certificate of Attendance' : 'Certificate of Completion';
}

export const verifyUrl = (code) => `${SITE_URL}/verify/${code}`;

/** "cloudwise.co.ke/verify/CW-…", short enough to print and to read aloud. */
export const verifyUrlShort = (code) => `cloudwise.co.ke/verify/${code}`;

/** Hours and the one-line summary printed under the course name. */
export function certificateCourse(certificate) {
  const track = TRACKS[certificate?.track];
  return {
    name: certificate?.courseName || track?.name || 'AI training',
    hours: track?.certificate?.hours || null,
    summary: track?.certificate?.summary || null,
  };
}

export function certificateDate(certificate) {
  const iso = certificate?.classDate || certificate?.issuedAt?.slice(0, 10);
  return iso ? formatDay(iso, { long: true }).replace(/^\w+, /, '') : '';
}

/** Month and year, the way LinkedIn shows an issue date: "Nov 2026". */
export function certificateMonth(certificate) {
  const iso = certificate?.classDate || certificate?.issuedAt?.slice(0, 10);
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/**
 * LinkedIn's "Add to profile" link, prefilled with this certificate.
 *
 * `organizationId` makes LinkedIn link the certificate to the Cloudwise
 * Technologies company page, which is what puts the logo beside it.
 * `organizationName` is kept as the fallback LinkedIn shows if it cannot
 * resolve the id.
 */
export function linkedInAddUrl(certificate) {
  const date = new Date(`${certificate.classDate || certificate.issuedAt?.slice(0, 10)}T00:00:00Z`);
  const params = new URLSearchParams({
    startTask: 'CERTIFICATION_NAME',
    name: certificate.courseName,
    organizationId: CERTIFICATE_ISSUER.linkedInOrganizationId,
    organizationName: CERTIFICATE_ISSUER.name,
    issueYear: String(date.getUTCFullYear()),
    issueMonth: String(date.getUTCMonth() + 1),
    certId: certificate.code,
    certUrl: verifyUrl(certificate.code),
  });
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

/** A line the holder can paste into a CV, under "Certifications". */
export function cvLine(certificate) {
  const course = certificateCourse(certificate);
  return [
    `${course.name}${course.hours ? ` (${course.hours} hours)` : ''}, ${CERTIFICATE_ISSUER.name}, ${certificateMonth(certificate)}.`,
    `Credential ID ${certificate.code}, verify at ${verifyUrlShort(certificate.code)}`,
  ].join(' ');
}

/**
 * The sample shown on the website. The code is shaped like a real one but is
 * never issued: getCertificate would find nothing, and /verify/CW-SAMPLE01
 * explains that it is a sample.
 */
export const SAMPLE_CODE = 'CW-SAMPLE01';

export function sampleCertificate(track = TRACK_KICKSTART, { name = 'Wanjiru Kamau', classDate } = {}) {
  return {
    code: SAMPLE_CODE,
    name,
    kind: 'completion',
    track,
    courseName: TRACKS[track]?.name || 'AI Kickstart',
    classDate: classDate || new Date().toISOString().slice(0, 10),
    sample: true,
  };
}
