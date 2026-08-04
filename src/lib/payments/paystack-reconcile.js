import 'server-only';

import { confirmPayment, onPaymentFailed } from '@/lib/lifecycle';
import { getPayment, getRegistration, patchPayment } from '@/lib/store';

import { verifyTransaction } from './paystack';

/**
 * Apply the outcome of a Paystack transaction to our records.
 *
 * Shared by the webhook and the return-from-checkout verify, which race each
 * other by design — whichever arrives first wins, and the other becomes a
 * no-op. Both re-verify against Paystack rather than trusting what they were
 * handed: a browser redirect carries no proof of payment, and the amount must
 * be checked against what we actually asked for.
 */
export async function reconcilePaystack(attemptReference) {
  const payment = await getPayment('paystack', attemptReference);
  if (!payment) return { status: 'unknown', reason: 'no matching payment attempt' };

  const registration = await getRegistration(payment.registrationRef);
  if (!registration) return { status: 'unknown', reason: 'no matching registration' };

  if (registration.status === 'paid') {
    return { status: 'paid', registration, alreadyPaid: true };
  }

  let verified;
  try {
    verified = await verifyTransaction(attemptReference);
  } catch (err) {
    console.error('[paystack] verify failed:', err?.message);
    return { status: 'pending', reason: err?.message };
  }

  if (!verified.succeeded) {
    if (payment.status === 'pending') {
      await patchPayment('paystack', attemptReference, {
        status: 'failed',
        resultDescription: verified.gatewayResponse || verified.status,
        rawCallback: JSON.stringify(verified.raw, null, 2),
        completedAt: new Date().toISOString(),
      });
      await onPaymentFailed({ registration, reason: verified.gatewayResponse || 'Card declined' });
    }
    return { status: 'failed', registration, message: verified.gatewayResponse };
  }

  // Guard against a transaction that succeeded for the wrong amount or currency.
  if (verified.currency !== 'KES' || verified.amountKes < Number(registration.amount)) {
    console.error(
      `[paystack] amount mismatch on ${attemptReference}: paid ${verified.amountKes} ${verified.currency}, expected ${registration.amount} KES`
    );
    await patchPayment('paystack', attemptReference, {
      status: 'failed',
      resultDescription: `Amount mismatch: received ${verified.amountKes} ${verified.currency}.`,
      rawCallback: JSON.stringify(verified.raw, null, 2),
    });
    return { status: 'failed', registration, message: 'The amount paid did not match the booking.' };
  }

  await patchPayment('paystack', attemptReference, {
    status: 'completed',
    receipt: verified.reference,
    resultDescription: verified.gatewayResponse || 'Card payment successful',
    rawCallback: JSON.stringify(verified.raw, null, 2),
    completedAt: new Date().toISOString(),
    // Card money lands in the Paystack balance and is settled to the bank on
    // Paystack's own schedule, so there is nothing for us to sweep.
    settlementState: 'na',
  });

  await confirmPayment({
    registration,
    // No sweep: `settlementState: 'na'` makes maybeSettle skip this payment.
    payment: { ...payment, status: 'completed', settlementState: 'na' },
    method: 'card',
    receipt: verified.reference,
    paidAt: verified.paidAt,
  });

  return { status: 'paid', registration, receipt: verified.reference };
}
