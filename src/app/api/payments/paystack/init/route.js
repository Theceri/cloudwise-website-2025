import { NextResponse } from 'next/server';

import { initializeTransaction, isCardPaymentEnabled } from '@/lib/payments/paystack';
import { publicBaseUrl } from '@/lib/runtime';
import { createPayment, getRegistration } from '@/lib/store';
import { getTrack, normaliseReference } from '@/lib/training';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Start a card payment and hand back Paystack's hosted checkout URL.
 *
 * The Paystack transaction reference is our booking reference plus a timestamp:
 * unique per attempt (Paystack rejects a reused one after a failure) while
 * still pointing unambiguously back at the registration.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const reference = normaliseReference(body?.reference);
  if (!reference) {
    return NextResponse.json({ error: 'Unknown booking reference.' }, { status: 400 });
  }

  if (!isCardPaymentEnabled()) {
    return NextResponse.json(
      { error: 'Card payments are not connected yet. Please pay with M-Pesa.' },
      { status: 503 }
    );
  }

  const registration = await getRegistration(reference);
  if (!registration) {
    return NextResponse.json({ error: 'We could not find that booking.' }, { status: 404 });
  }
  if (registration.status === 'paid') {
    return NextResponse.json({ error: 'This booking is already paid.' }, { status: 409 });
  }

  const attemptRef = `${reference}-${Date.now().toString(36).toUpperCase()}`;
  const track = getTrack(registration.track);

  try {
    const session = await initializeTransaction({
      email: registration.email,
      amountKes: registration.amount,
      reference: attemptRef,
      callbackUrl: `${publicBaseUrl()}/checkout/${reference}/complete`,
      metadata: {
        registrationRef: reference,
        track: registration.track,
        cohort: registration.cohortLabel || null,
        custom_fields: [
          {
            display_name: 'Training',
            variable_name: 'training',
            value: track?.name || registration.track,
          },
          {
            display_name: 'Booking reference',
            variable_name: 'booking_reference',
            value: reference,
          },
        ],
      },
    });

    await createPayment({
      provider: 'paystack',
      externalId: attemptRef,
      registrationRef: reference,
      amount: registration.amount,
      rawRequest: JSON.stringify(
        { email: registration.email, amountKes: registration.amount, reference: attemptRef },
        null,
        2
      ),
      rawResponse: JSON.stringify(session, null, 2),
    });

    return NextResponse.json({ ok: true, authorizationUrl: session.authorizationUrl, reference: attemptRef });
  } catch (err) {
    console.error('[paystack/init] failed:', err?.message);
    return NextResponse.json(
      { error: err?.message || 'We could not start the card payment. Please try M-Pesa.' },
      { status: 502 }
    );
  }
}
