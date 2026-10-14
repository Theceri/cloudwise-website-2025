import { NextResponse } from 'next/server';

import { findCredit, priceAfterCredit, releaseCredit, reserveCredit } from '@/lib/credits';
import { onRegistrationCreated } from '@/lib/lifecycle';
import { readAttribution } from '@/lib/meta/capi';
import { normalisePhone } from '@/lib/payments/daraja';
import { TEAM_LEAD_HEADCOUNT, validateRegistration } from '@/lib/registration-form';
import { countPaidRegistrations, createRegistration, isStoreConfigured } from '@/lib/store';
import {
  TRACKS,
  TRACK_ESSENTIALS,
  TRACK_KICKSTART,
  TRACK_PROGRAMME,
  chargeFor,
  describeSchedule,
  generateReference,
  getCohort,
  isBookingDateOpen,
  priceFor,
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

  const track = TRACKS[value.track];

  // A date that has closed must not be bookable, however stale the page is.
  // The pages are rebuilt hourly, so this is the check that actually counts.
  if (!isBookingDateOpen(value.track, value.cohortId)) {
    return NextResponse.json(
      {
        error:
          value.track === TRACK_KICKSTART
            ? 'That Wednesday has closed. Please pick another.'
            : 'Those dates have closed. Please pick another date.',
        errors: { cohortId: 'This date has closed.' },
      },
      { status: 409 }
    );
  }

  // A Kickstart session is one Google Meet call with a hard limit.
  if (track.capacity) {
    const sold = await countPaidRegistrations({ track: value.track, cohortId: value.cohortId });
    if (sold >= track.capacity) {
      return NextResponse.json(
        { error: 'That Wednesday is full. Please pick another.', errors: { cohortId: 'This session is full.' } },
        { status: 409 }
      );
    }
  }

  const phone = normalisePhone(value.phone) || value.phone;

  // Credits: a code the buyer typed, or else any credit held by their phone or
  // email. The code must belong to the same person, so a code read off
  // someone else's SMS finds nothing.
  let credit = null;
  if (value.track === TRACK_ESSENTIALS || value.track === TRACK_PROGRAMME) {
    credit = await findCredit({ code: value.creditCode, phone, email: value.email, track: value.track });
    if (value.creditCode && !credit) {
      return NextResponse.json(
        {
          error: 'Please check the highlighted fields.',
          errors: {
            creditCode:
              'We could not find a credit for that code with this phone number or email. Check the code, or leave it empty.',
          },
        },
        { status: 400 }
      );
    }
  }

  // An Essentials credit pays for Day One, so its holder books Day Two only,
  // and only on a Day Two that falls before the credit ends.
  const essentialsCredit = credit && credit.amountKes === TRACKS[TRACK_ESSENTIALS].credit.amountKes;
  let attendsDays = track.days || null;
  if (value.track === TRACK_PROGRAMME && essentialsCredit) {
    const cohort = getCohort(value.cohortId);
    if (!cohort || cohort.dayTwo > credit.expiresAt.slice(0, 10)) {
      return NextResponse.json(
        {
          error: 'Your Essentials credit does not reach that Day Two. Please pick an earlier date.',
          errors: { cohortId: 'Pick a Day Two before your credit ends.' },
        },
        { status: 409 }
      );
    }
    attendsDays = ['day-two'];
  }

  const reference = generateReference(value.track);

  if (credit && !(await reserveCredit(credit, reference))) {
    // Another booking is holding it right now. Book at full price rather than fail.
    credit = null;
    attendsDays = track.days || null;
  }

  const schedule = describeSchedule({ track: value.track, cohortId: value.cohortId, attendsDays });
  const headcount = value.headcount || 1;

  // The typed code is not stored: `creditApplied` records the credit used.
  const { creditCode: _typedCode, ...fields } = value;

  const doc = {
    ...fields,
    reference,
    // Store the M-Pesa-ready form so callbacks and STK pushes agree on it.
    phone,
    // What the price list says, and what this booking actually owes after any
    // credit. In test mode `amount` is the token figure; `listPrice` is not.
    listPrice: priceFor(value.track),
    amount: credit ? priceAfterCredit({ track: value.track, credit }) : chargeFor(value.track),
    creditApplied: credit
      ? {
          code: credit.code,
          amountKes: credit.amountKes,
          sourceReference: credit.sourceReference || null,
          sourceReceipt: credit.sourceReceipt || null,
        }
      : null,
    attendsDays,
    teamLead: value.buyerType === 'colleagues' || headcount >= TEAM_LEAD_HEADCOUNT,
    cohortLabel: schedule.headline,
    startDate: startDateFor({ track: value.track, cohortId: value.cohortId, attendsDays }),
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
    // Give back a credit held for a booking that now does not exist.
    if (doc.creditApplied) {
      await releaseCredit({ reference, creditApplied: doc.creditApplied }).catch(() => {});
    }
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
      listPrice: registration.listPrice,
      creditApplied: registration.creditApplied,
      checkoutUrl: `/checkout/${reference}`,
    },
    { status: 201 }
  );
}
