import { NextResponse } from 'next/server';

import { confirmPayment } from '@/lib/lifecycle';
import { isAuthorisedJob } from '@/lib/security';
import {
  createPayment,
  findPaymentByReceipt,
  getPayment,
  getRegistration,
  paymentId,
} from '@/lib/store';
import { formatKes, normaliseReference } from '@/lib/training';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Confirm a paybill payment by hand, from the M-Pesa code on the SMS.
 *
 * C2B has no "what happened to this payment" query the way STK does — Safaricom
 * tells us once, over a webhook, and if that delivery fails there is no second
 * chance. A tunnel that changed address, a deploy mid-flight, a URL registered
 * against the wrong environment: the money is real and in the paybill, but the
 * seat never confirms and the customer never gets their receipt.
 *
 * This is the way out. Take the M-Pesa code from the confirmation SMS and post
 * it here; everything downstream then happens exactly as it would have — the
 * payment is recorded, the seat is confirmed, both emails go out and the
 * settlement sweep picks it up.
 *
 * The record is written as `mpesa-c2b` under the real M-Pesa code, so if
 * Safaricom's confirmation does eventually turn up it deduplicates against this
 * one instead of paying the booking twice.
 *
 *   curl -X POST https://cloudwise.co.ke/api/payments/paybill/reconcile \
 *     -H "Authorization: Bearer $CRON_SECRET" \
 *     -H "Content-Type: application/json" \
 *     -d '{"reference":"A2KWGM","receipt":"TH41ABCD2X"}'
 */
export async function POST(request) {
  if (!isAuthorisedJob(request)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }

  const reference = normaliseReference(body?.reference);
  if (!reference) {
    return NextResponse.json({ error: 'A valid booking reference is required.' }, { status: 400 });
  }

  // The M-Pesa code is what makes this idempotent and auditable, so it is not
  // optional — reconciling without one would let the same payment be applied
  // twice and leave nothing to check a statement against.
  const receipt = String(body?.receipt || '').trim().toUpperCase();
  if (!receipt) {
    return NextResponse.json(
      { error: 'The M-Pesa code from the confirmation SMS is required.' },
      { status: 400 }
    );
  }

  const registration = await getRegistration(reference);
  if (!registration) {
    return NextResponse.json({ error: `No booking found for ${reference}.` }, { status: 404 });
  }

  const amount = Number(body?.amount ?? registration.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: 'Amount must be a positive number.' }, { status: 400 });
  }

  const shortfall = Number(registration.amount) - amount;
  if (shortfall > 0) {
    return NextResponse.json(
      {
        error:
          `That is a part payment — ${formatKes(amount)} against ${formatKes(registration.amount)}, ` +
          `${formatKes(shortfall)} still owing. Collect the balance, or pass the full ` +
          `amount explicitly to accept it as settled in full.`,
      },
      { status: 409 }
    );
  }

  // Already handled — by the webhook arriving late, or by someone running this
  // twice. Say so plainly rather than writing a second record.
  if (await getPayment('mpesa-c2b', receipt)) {
    return NextResponse.json({
      ok: true,
      alreadyRecorded: true,
      reference,
      receipt,
      status: registration.status,
    });
  }

  const elsewhere = await findPaymentByReceipt(receipt, {
    excludeId: paymentId('mpesa-c2b', receipt),
  });

  await createPayment({
    provider: 'mpesa-c2b',
    externalId: receipt,
    registrationRef: reference,
    amount,
    phone: body?.phone || registration.phone || '',
    receipt,
    status: 'completed',
    resultDescription: elsewhere
      ? `Reconciled by hand, but already recorded as ${elsewhere.provider} — not settled twice`
      : `Reconciled by hand from the M-Pesa confirmation${body?.note ? `: ${body.note}` : ''}`,
    completedAt: new Date().toISOString(),
    // Money already swept for this code must not be swept again.
    settlementState: elsewhere ? 'skipped' : 'pending',
  });

  if (registration.status === 'paid') {
    return NextResponse.json({
      ok: true,
      alreadyPaid: true,
      reference,
      receipt,
      message: 'Payment recorded. The booking was already confirmed, so no emails were resent.',
    });
  }

  const result = await confirmPayment({
    registration,
    payment: {
      provider: 'mpesa-c2b',
      externalId: receipt,
      registrationRef: reference,
      amount,
      status: 'completed',
      settlementState: elsewhere ? 'skipped' : 'pending',
      receipt,
    },
    method: 'mpesa-c2b',
    receipt,
    paidAt: body?.paidAt || undefined,
  });

  return NextResponse.json({
    ok: true,
    reference,
    receipt,
    amount,
    confirmed: !result.alreadyPaid,
    emails: result.effects
      ? {
          receipt: result.effects.customer?.ok ?? result.effects.customer?.skipped ?? false,
          welcomePack: result.effects.welcomePack?.ok ?? result.effects.welcomePack?.skipped ?? false,
          admins: result.effects.admin?.ok ?? false,
        }
      : null,
    settlement: result.effects?.settlement ?? null,
  });
}
