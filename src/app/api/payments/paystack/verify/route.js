import { NextResponse } from 'next/server';

import { reconcilePaystack } from '@/lib/payments/paystack-reconcile';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Verify a card payment when the customer lands back from Paystack.
 *
 * Paystack's redirect proves nothing on its own, so this asks Paystack's API
 * what really happened. It also means the customer sees a confirmed booking
 * immediately instead of waiting on the webhook.
 */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const attemptReference = body?.reference;
  if (!attemptReference || typeof attemptReference !== 'string') {
    return NextResponse.json({ error: 'Missing payment reference.' }, { status: 400 });
  }

  try {
    const result = await reconcilePaystack(attemptReference);
    return NextResponse.json({
      status: result.status,
      message: result.message || null,
      bookingReference: result.registration?.reference || null,
    });
  } catch (err) {
    console.error('[paystack/verify] failed:', err?.message);
    return NextResponse.json({ error: 'We could not confirm that payment.' }, { status: 502 });
  }
}
