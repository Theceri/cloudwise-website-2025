import { NextResponse } from 'next/server';

import { onRegistrationCreated } from '@/lib/lifecycle';
import { readAttribution } from '@/lib/meta/capi';
import { normalisePhone } from '@/lib/payments/daraja';
import { validateRegistration } from '@/lib/registration-form';
import { createRegistration, isStoreConfigured } from '@/lib/store';
import {
  TRACK_INDIVIDUAL,
  chargeFor,
  describeSchedule,
  generateReference,
  isCohortOpen,
  startDateFor,
} from '@/lib/training';

export const runtime = 'nodejs';

const UTM_FIELDS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid', 'landingPage',
];

/**
 * Keep only the known source fields, as short strings. The browser sends what
 * it stored on the first landing (src/components/UtmCapture.js); anything else
 * in the object is dropped rather than written to the roster.
 */
function cleanUtm(input) {
  if (!input || typeof input !== 'object') return null;
  const out = {};
  for (const key of UTM_FIELDS) {
    if (typeof input[key] === 'string' && input[key].trim()) out[key] = input[key].trim().slice(0, 200);
  }
  if (typeof input.capturedAt === 'string' && !Number.isNaN(Date.parse(input.capturedAt))) {
    out.capturedAt = new Date(input.capturedAt).toISOString();
  }
  return Object.keys(out).length ? out : null;
}
export const dynamic = 'force-dynamic';

/**
 * Create a registration.
 *
 * Returns the reference the browser then takes to /checkout/[ref]. The price is
 * resolved server-side from the track — never trusted from the request — so a
 * tampered form cannot buy a Ksh 13,500 seat for one shilling.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!isStoreConfigured()) {
    return NextResponse.json(
      { error: 'Registration is not configured yet. Please contact us and we will book you in.' },
      { status: 503 }
    );
  }

  const { ok, errors, value } = validateRegistration(body);
  if (!ok) {
    return NextResponse.json({ error: 'Please check the highlighted fields.', errors }, { status: 400 });
  }

  // A cohort that has closed must not be bookable, however stale the page is.
  if (value.track === TRACK_INDIVIDUAL && !isCohortOpen(value.cohortId)) {
    return NextResponse.json(
      { error: 'Those dates have closed. Please pick another cohort.', errors: { cohortId: 'This cohort has closed.' } },
      { status: 409 }
    );
  }

  const reference = generateReference(value.track);
  const schedule = describeSchedule({ track: value.track, cohortId: value.cohortId });

  const doc = {
    ...value,
    reference,
    // Store the M-Pesa-ready form so callbacks and STK pushes agree on it.
    phone: normalisePhone(value.phone) || value.phone,
    // chargeFor, not priceFor: in test mode this is the token amount. The price
    // shown on the site is unaffected.
    amount: chargeFor(value.track),
    cohortLabel: value.track === TRACK_INDIVIDUAL ? schedule.headline : null,
    startDate: startDateFor({ track: value.track, cohortId: value.cohortId }),
    settlementState: 'na',
    // Meta's ad attribution lives in browser cookies, and the payment is
    // confirmed later by a webhook with no browser attached — sometimes days
    // later, from a paybill on a phone that never opened the site. This is the
    // last moment the cookies exist, so they are stored and replayed with the
    // Purchase event whenever the money actually lands.
    metaAttribution: readAttribution(request, { eventSourceUrl: body?.pageUrl }),
    utm: cleanUtm(body?.attribution),
  };

  let registration;
  try {
    registration = await createRegistration(doc);
  } catch (err) {
    console.error('[registrations] create failed:', err?.message);
    return NextResponse.json(
      { error: 'We could not save your registration. Please try again.' },
      { status: 500 }
    );
  }

  // Notifications must not block the redirect to checkout, but on serverless
  // the function can be frozen the moment we respond — so we await them.
  await onRegistrationCreated(registration).catch((err) =>
    console.error('[registrations] notifications failed:', err?.message)
  );

  return NextResponse.json(
    {
      ok: true,
      reference,
      amount: registration.amount,
      checkoutUrl: `/checkout/${reference}`,
    },
    { status: 201 }
  );
}
