import { NextResponse } from 'next/server';

import { confirmPayment, onPaymentFailed } from '@/lib/lifecycle';
import { isDarajaConfigured, stkQuery } from '@/lib/payments/daraja';
import { getRegistration, latestPaymentFor, patchPayment } from '@/lib/store';
import { normaliseReference } from '@/lib/training';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Payment status for the checkout page to poll.
 *
 * This is also the reconciliation path. Safaricom's callback can be lost — a
 * tunnel drops, a deploy lands mid-flight — so when the registration is still
 * unpaid we ask Daraja directly what happened to the STK push and finish the
 * job from the answer. Without this, a customer who has genuinely paid would
 * sit on a spinner.
 */
export async function GET(request, { params }) {
  const { ref: rawRef } = await params;
  const ref = normaliseReference(rawRef);

  if (!ref) {
    return NextResponse.json({ error: 'Unknown reference.' }, { status: 400 });
  }

  const registration = await getRegistration(ref);
  if (!registration) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }

  if (registration.status === 'paid') {
    return NextResponse.json({
      status: 'paid',
      reference: ref,
      amount: registration.amount,
      receipt: registration.paymentReceipt || null,
      method: registration.paymentMethod || null,
    });
  }

  const payment = await latestPaymentFor(ref);

  // Nothing attempted yet, or the last attempt already failed.
  if (!payment || payment.provider !== 'mpesa-stk' || payment.status !== 'pending') {
    return NextResponse.json({
      status: registration.status,
      reference: ref,
      amount: registration.amount,
      lastAttempt: payment
        ? { provider: payment.provider, status: payment.status, message: payment.resultDescription }
        : null,
    });
  }

  if (!isDarajaConfigured()) {
    return NextResponse.json({ status: 'pending', reference: ref, amount: registration.amount });
  }

  try {
    const query = await stkQuery(payment.externalId);

    if (query.state === 'completed') {
      // The push succeeded but we never got the callback. The v2 query carries
      // the M-Pesa code, so the reconciled payment is as complete as one
      // confirmed by the callback itself.
      const receipt = query.receipt || payment.receipt || null;

      await patchPayment('mpesa-stk', payment.externalId, {
        status: 'completed',
        receipt,
        resultDescription: query.description || 'Confirmed by status query.',
        rawCallback: JSON.stringify(query.raw, null, 2),
        completedAt: new Date().toISOString(),
        settlementState: 'pending',
      });

      await confirmPayment({
        registration,
        payment: { ...payment, status: 'completed', settlementState: 'pending', receipt },
        method: 'mpesa-stk',
        receipt,
      });

      return NextResponse.json({
        status: 'paid',
        reference: ref,
        amount: registration.amount,
        receipt,
        method: 'mpesa-stk',
      });
    }

    if (query.state === 'failed') {
      await patchPayment('mpesa-stk', payment.externalId, {
        status: 'failed',
        resultDescription: query.description || 'Payment was not completed.',
        rawCallback: JSON.stringify(query.raw, null, 2),
        completedAt: new Date().toISOString(),
      });
      await onPaymentFailed({ registration, reason: query.description });

      return NextResponse.json({
        status: 'failed',
        reference: ref,
        amount: registration.amount,
        message: query.description || 'The payment was not completed.',
      });
    }
  } catch (err) {
    // A query failure is not a payment failure — keep the caller polling.
    console.error('[status] stk query failed:', err?.message);
  }

  return NextResponse.json({ status: 'pending', reference: ref, amount: registration.amount });
}
