import { NextResponse } from 'next/server';

import { issueCertificate } from '@/lib/certificates';
import { sendOnce } from '@/lib/email/send';
import { certificateIssued } from '@/lib/email/templates';
import { isAuthorisedJob } from '@/lib/security';
import { getRegistration, listRegistrations } from '@/lib/store';
import { normaliseReference } from '@/lib/training';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// A Studio request counts only for bookings marked this recently.
const STUDIO_REQUEST_WINDOW_MS = 30 * 60 * 1000;

/**
 * Issue certificates after a class, and email each one.
 *
 * Two callers:
 *   - The Studio buttons (src/sanity/actions/issueCertificates.js). No secret:
 *     the Studio first sets certificateRequestedAt on each booking, and only
 *     bookings marked in the last 30 minutes are issued. Only Studio editors
 *     can mark a booking.
 *   - An admin script with the CRON_SECRET as `Authorization: Bearer …`.
 *
 * Body, one of:
 *
 *   { "references": ["A7F3K2", "E9K2M4"] }        named bookings
 *   { "cohortId": "2026-11", "track": "individual" } every paid booking on
 *                                                     that cohort and course
 *
 * Only paid Essentials and Programme bookings get one. Safe to run twice: a
 * booking that already has a certificate is skipped. Revoke a certificate
 * given in error in the Studio (Training → Certificates).
 */
export async function POST(request) {
  const admin = isAuthorisedJob(request);

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  let registrations = [];
  if (Array.isArray(body?.references)) {
    for (const raw of body.references.slice(0, 200)) {
      const ref = normaliseReference(raw);
      const reg = ref ? await getRegistration(ref) : null;
      if (reg) registrations.push(reg);
    }
    if (!admin) {
      const cutoff = Date.now() - STUDIO_REQUEST_WINDOW_MS;
      registrations = registrations.filter((r) => Date.parse(r.certificateRequestedAt || '') > cutoff);
      if (!registrations.length) {
        return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
      }
    }
  } else if (!admin) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  } else if (body?.cohortId && body?.track) {
    registrations = await listRegistrations({ cohortId: body.cohortId, track: body.track, status: 'paid' });
    // The roster query returns a summary; fetch the full documents.
    registrations = (await Promise.all(registrations.map((r) => getRegistration(r.reference)))).filter(Boolean);
  } else {
    return NextResponse.json({ error: 'Send "references", or "cohortId" with "track".' }, { status: 400 });
  }

  const results = [];
  for (const registration of registrations) {
    try {
      const outcome = await issueCertificate(registration);
      let emailed = false;
      if (outcome.issued) {
        const sent = await sendOnce({
          reference: registration.reference,
          key: 'certificate-issued',
          to: registration.email,
          // A copy for Cloudwise: Resend sends outside Zoho, so without this
          // no mailbox keeps a record of what the student received.
          bcc: ['training@cloudwise.co.ke'],
          ...certificateIssued({ registration, certificate: outcome.certificate }),
        });
        emailed = Boolean(sent?.ok);
      }
      results.push({
        reference: registration.reference,
        issued: outcome.issued,
        code: outcome.certificate?.code || null,
        reason: outcome.reason || null,
        emailed,
      });
    } catch (err) {
      results.push({ reference: registration.reference, issued: false, reason: err?.message });
    }
  }

  return NextResponse.json({ ok: true, count: results.filter((r) => r.issued).length, results });
}
