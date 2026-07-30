import { NextResponse } from 'next/server';

import { sendToAdmins } from '@/lib/email/send';
import { confirmPayment } from '@/lib/lifecycle';
import { parseC2bConfirmation } from '@/lib/payments/daraja';
import { createPayment, getPayment, getRegistration } from '@/lib/store';
import { formatKes, isValidReference } from '@/lib/training';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Daraja C2B confirmation — someone paid the paybill directly.
 *
 * This is the fallback the checkout page shows alongside the STK push, and it
 * carries real weight: prompts get missed, phones are off, and Safaricom has
 * bad afternoons. The account number the customer typed is the booking
 * reference, which is what lets a payment made entirely outside our website
 * confirm the right seat.
 *
 * Always answers 200 — Safaricom retries anything else, and a retry cannot fix
 * a payment we have already handled.
 */
export async function POST(request) {
  const accepted = NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });

  let body;
  try {
    body = await request.json();
  } catch {
    console.warn('[mpesa/c2b] non-JSON body');
    return accepted;
  }

  const payment = parseC2bConfirmation(body);
  if (!payment) {
    console.warn('[mpesa/c2b] unrecognised shape:', JSON.stringify(body).slice(0, 400));
    return accepted;
  }

  try {
    // Idempotency: the M-Pesa transaction id is the document id, so a repeat
    // delivery finds the record already there and stops.
    if (await getPayment('mpesa-c2b', payment.transactionId)) return accepted;

    const registration = isValidReference(payment.reference)
      ? await getRegistration(payment.reference)
      : null;

    if (!registration) {
      // Money we cannot attribute. Never silently swallowed — an admin needs to
      // match it by hand, and the payer is waiting on a confirmation.
      await unattributed(payment);
      return accepted;
    }

    await createPayment({
      provider: 'mpesa-c2b',
      externalId: payment.transactionId,
      registrationRef: registration.reference,
      amount: payment.amount,
      phone: payment.phone,
      receipt: payment.transactionId,
      status: 'completed',
      resultDescription: `Paid directly to the paybill by ${payment.payerName || 'customer'}`,
      rawCallback: JSON.stringify(body, null, 2),
      completedAt: new Date().toISOString(),
      settlementState: 'pending',
    });

    // A short payment must not confirm a seat. Flag it and let a human decide.
    if (payment.amount < Number(registration.amount)) {
      await underpaid({ registration, payment });
      return accepted;
    }

    if (registration.status === 'paid') return accepted;

    await confirmPayment({
      registration,
      payment: {
        provider: 'mpesa-c2b',
        externalId: payment.transactionId,
        registrationRef: registration.reference,
        amount: payment.amount,
        status: 'completed',
        settlementState: 'pending',
      },
      method: 'mpesa-c2b',
      receipt: payment.transactionId,
    });
  } catch (err) {
    console.error('[mpesa/c2b] processing failed:', err?.message);
  }

  return accepted;
}

async function unattributed(payment) {
  console.warn('[mpesa/c2b] unattributed payment:', payment.transactionId, payment.reference);

  await sendToAdmins({
    subject: `⚠️ Unmatched M-Pesa payment — ${formatKes(payment.amount)} from ${payment.payerName || payment.phone}`,
    html: `
      <p>An M-Pesa payment arrived at the paybill that does not match any booking.</p>
      <ul>
        <li><strong>Amount:</strong> ${formatKes(payment.amount)}</li>
        <li><strong>M-Pesa code:</strong> ${payment.transactionId}</li>
        <li><strong>Account number typed:</strong> ${payment.reference || '(blank)'}</li>
        <li><strong>From:</strong> ${payment.payerName || 'unknown'} (${payment.phone || 'no number'})</li>
      </ul>
      <p>They have most likely mistyped their booking reference. Call or message
      them, find their registration, and confirm it by hand.</p>
    `,
  }).catch(() => {});
}

async function underpaid({ registration, payment }) {
  console.warn(
    `[mpesa/c2b] underpaid ${registration.reference}: ${payment.amount} of ${registration.amount}`
  );

  await sendToAdmins({
    subject: `⚠️ Part payment — ${registration.firstName} ${registration.lastName} paid ${formatKes(payment.amount)}`,
    html: `
      <p><strong>${registration.firstName} ${registration.lastName}</strong> paid
      ${formatKes(payment.amount)} against a booking of
      ${formatKes(registration.amount)}.</p>
      <ul>
        <li><strong>Reference:</strong> ${registration.reference}</li>
        <li><strong>M-Pesa code:</strong> ${payment.transactionId}</li>
        <li><strong>Still owing:</strong> ${formatKes(Number(registration.amount) - payment.amount)}</li>
        <li><strong>Contact:</strong> ${registration.email} · ${registration.phone}</li>
      </ul>
      <p>The booking has <em>not</em> been confirmed. Decide whether to accept the
      part payment or ask for the balance, then confirm it by hand.</p>
    `,
  }).catch(() => {});
}
