import { NextResponse } from 'next/server';

import { confirmPayment, onPaymentFailed } from '@/lib/lifecycle';
import { parseStkCallback } from '@/lib/payments/daraja';
import { getPayment, getRegistration, patchPayment } from '@/lib/store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Daraja's STK push result callback.
 *
 * Safaricom retries until it gets a 200, and does not sign its callbacks — so
 * this endpoint must be idempotent rather than authenticated. It is: every
 * effect is keyed off the CheckoutRequestID, and the claims inside
 * confirmPayment make a repeat delivery a no-op.
 *
 * It always answers 200. A non-200 makes Safaricom retry a callback we have
 * already handled, which achieves nothing but noise.
 */
export async function POST(request) {
  const accepted = NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });

  let body;
  try {
    body = await request.json();
  } catch {
    console.warn('[mpesa/callback] non-JSON body');
    return accepted;
  }

  const callback = parseStkCallback(body);
  if (!callback?.checkoutRequestId) {
    console.warn('[mpesa/callback] unrecognised shape:', JSON.stringify(body).slice(0, 400));
    return accepted;
  }

  try {
    const payment = await getPayment('mpesa-stk', callback.checkoutRequestId);
    if (!payment) {
      console.warn('[mpesa/callback] no payment for', callback.checkoutRequestId);
      return accepted;
    }

    // Already settled one way or the other by an earlier delivery.
    if (payment.status !== 'pending') return accepted;

    await patchPayment('mpesa-stk', callback.checkoutRequestId, {
      status: callback.succeeded ? 'completed' : 'failed',
      receipt: callback.receipt || null,
      resultDescription: callback.resultDescription || null,
      rawCallback: JSON.stringify(body, null, 2),
      completedAt: new Date().toISOString(),
      ...(callback.succeeded ? { settlementState: 'pending' } : {}),
    });

    const registration = await getRegistration(payment.registrationRef);
    if (!registration) {
      console.warn('[mpesa/callback] no registration for', payment.registrationRef);
      return accepted;
    }

    if (callback.succeeded) {
      await confirmPayment({
        registration,
        payment: {
          ...payment,
          status: 'completed',
          settlementState: 'pending',
          receipt: callback.receipt,
        },
        method: 'mpesa-stk',
        receipt: callback.receipt,
      });
    } else {
      await onPaymentFailed({ registration, reason: callback.resultDescription });
    }
  } catch (err) {
    // Swallow: retrying will not help, and the status poll reconciles anyway.
    console.error('[mpesa/callback] processing failed:', err?.message);
  }

  return accepted;
}
