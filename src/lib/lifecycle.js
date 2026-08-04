import 'server-only';

import { paybillInstructions } from '@/lib/payments/daraja';
import { sendOnce, sendToAdmins } from '@/lib/email/send';
import * as templates from '@/lib/email/templates';
import { listRegistrations, patchRegistration } from '@/lib/store';
import { maybeSettle } from '@/lib/settlement';

/**
 * The state machine's side effects, in one place.
 *
 * Routes decide *what happened*; this module decides *who hears about it*.
 * Every function here swallows its own errors: a payment we have already taken
 * must never be rolled back because an email bounced.
 */

/** Everyone currently signed up — the roster attached to every admin alert. */
async function fullRoster() {
  try {
    return await listRegistrations({ limit: 500 });
  } catch (err) {
    console.error('[lifecycle] roster lookup failed:', err?.message);
    return [];
  }
}

/** Someone completed the form. Not paid yet. */
export async function onRegistrationCreated(registration) {
  const results = {};

  results.customer = await sendOnce({
    reference: registration.reference,
    key: 'registration-received',
    to: registration.email,
    ...templates.registrationReceived({
      registration,
      paybill: paybillInstructions(registration.reference),
    }),
  });

  results.admin = await sendToAdmins(
    templates.adminSignupAlert({
      registration,
      roster: await fullRoster(),
      event: 'registered',
    })
  );

  return results;
}

/**
 * Money is in. Confirm the seat, tell the admins, and start the sweep to the
 * bank account.
 */
export async function onPaymentConfirmed({ registration, payment }) {
  const results = {};

  results.customer = await sendOnce({
    reference: registration.reference,
    key: 'payment-confirmed',
    to: registration.email,
    ...templates.paymentConfirmed({ registration }),
  });

  // The preparation pack is a second, deliberately separate message: it is a
  // long read, and pairing it with the receipt buries it.
  results.welcomePack = await sendOnce({
    reference: registration.reference,
    key: 'welcome-pack',
    to: registration.email,
    ...templates.welcomePack({ registration }),
  });

  results.admin = await sendToAdmins(
    templates.adminSignupAlert({
      registration,
      roster: await fullRoster(),
      event: 'paid',
    })
  );

  // Sweep the collection to the bank. Runs last so a settlement problem cannot
  // delay the customer's confirmation.
  if (payment) {
    try {
      results.settlement = await maybeSettle(payment);
    } catch (err) {
      console.error('[lifecycle] settlement threw:', err?.message);
      results.settlement = { settled: false, reason: err?.message };
    }
  }

  return results;
}

/** The STK push was cancelled, timed out, or the card was declined. */
export async function onPaymentFailed({ registration, reason }) {
  // Keyed by reason so a second, different failure can still reach them, but a
  // re-delivered callback for the same failure cannot.
  const key = `payment-failed.${String(reason || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 40)}`;

  return sendOnce({
    reference: registration.reference,
    key,
    to: registration.email,
    ...templates.paymentFailed({
      registration,
      reason,
      paybill: paybillInstructions(registration.reference),
    }),
  });
}

/**
 * Mark a registration paid and fire the confirmation side effects.
 *
 * Shared by the M-Pesa callback, the M-Pesa status poll and the Paystack
 * webhook, so all three converge on identical behaviour. The `sendOnce` claims
 * inside make it safe to call from more than one of them for the same payment.
 */
export async function confirmPayment({ registration, payment, method, receipt, paidAt }) {
  if (registration.status === 'paid') {
    // Already confirmed by another path — nothing further to do.
    return { alreadyPaid: true };
  }

  const paidFields = {
    status: 'paid',
    paymentMethod: method,
    paymentReceipt: receipt || null,
    paidAt: paidAt || new Date().toISOString(),
  };

  await patchRegistration(registration.reference, paidFields);

  const updated = { ...registration, ...paidFields };
  const effects = await onPaymentConfirmed({ registration: updated, payment });

  return { alreadyPaid: false, registration: updated, effects };
}
