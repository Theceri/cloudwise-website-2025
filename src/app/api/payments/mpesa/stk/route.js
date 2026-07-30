import { NextResponse } from 'next/server';

import {
  isDarajaConfigured,
  normalisePhone,
  paybillInstructions,
  stkPush,
} from '@/lib/payments/daraja';
import { callbackUrl } from '@/lib/runtime';
import { createPayment, getRegistration } from '@/lib/store';
import { isValidReference } from '@/lib/training';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Send the customer an M-Pesa PIN prompt.
 *
 * The paybill fallback instructions come back in the same response whether or
 * not the push succeeds, so the checkout page can always show a way to pay —
 * the pattern you see on Truehost and other Kenyan checkouts.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const { reference, phone } = body || {};
  if (!isValidReference(reference)) {
    return NextResponse.json({ error: 'Unknown booking reference.' }, { status: 400 });
  }

  const registration = await getRegistration(reference);
  if (!registration) {
    return NextResponse.json({ error: 'We could not find that booking.' }, { status: 404 });
  }
  if (registration.status === 'paid') {
    return NextResponse.json({ error: 'This booking is already paid.' }, { status: 409 });
  }

  const msisdn = normalisePhone(phone || registration.phone);
  if (!msisdn) {
    return NextResponse.json(
      { error: 'Enter a valid Kenyan mobile number, e.g. 0712 345 678.' },
      { status: 400 }
    );
  }

  const fallback = paybillInstructions(reference);

  if (!isDarajaConfigured()) {
    return NextResponse.json(
      {
        error: 'M-Pesa is not connected yet. Please use the paybill instructions below, or pay by card.',
        fallback,
      },
      { status: 503 }
    );
  }

  try {
    const result = await stkPush({
      phone: msisdn,
      amount: registration.amount,
      accountReference: reference,
      description: 'AI training',
      callbackUrl: callbackUrl('/api/payments/mpesa/callback'),
    });

    await createPayment({
      provider: 'mpesa-stk',
      externalId: result.checkoutRequestId,
      registrationRef: reference,
      amount: registration.amount,
      phone: msisdn,
      rawRequest: JSON.stringify(result.request, null, 2),
      rawResponse: JSON.stringify(result.response, null, 2),
    });

    return NextResponse.json({
      ok: true,
      checkoutRequestId: result.checkoutRequestId,
      message:
        result.customerMessage ||
        'Check your phone and enter your M-Pesa PIN to complete the payment.',
      fallback,
    });
  } catch (err) {
    console.error('[mpesa/stk] push failed:', err?.message);
    return NextResponse.json(
      {
        error:
          err?.message ||
          'We could not send the M-Pesa prompt. Please use the paybill instructions below.',
        fallback,
      },
      { status: 502 }
    );
  }
}
