import { NextResponse } from 'next/server';

import { reconcilePaystack } from '@/lib/payments/paystack-reconcile';
import { verifyWebhookSignature } from '@/lib/payments/paystack';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Paystack webhook.
 *
 * Unlike Daraja, Paystack signs its callbacks, so we verify before acting. The
 * body is read as raw text because the signature covers the exact bytes sent —
 * parsing and re-serialising would change key order and break the digest.
 */
export async function POST(request) {
  const raw = await request.text();
  const signature = request.headers.get('x-paystack-signature');

  if (!verifyWebhookSignature(raw, signature)) {
    console.warn('[paystack/webhook] bad signature');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ received: true });
  }

  // We only act on successful charges; failures reach the customer through the
  // return-from-checkout path, which has better context to explain them.
  if (event?.event === 'charge.success' && event?.data?.reference) {
    try {
      await reconcilePaystack(event.data.reference);
    } catch (err) {
      console.error('[paystack/webhook] reconcile failed:', err?.message);
    }
  }

  // Always 200: Paystack retries non-200s, and a retry cannot fix a bad event.
  return NextResponse.json({ received: true });
}
