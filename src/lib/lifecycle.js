import 'server-only';

import { paybillInstructions } from '@/lib/payments/daraja';
import { sendOnce, sendToAdmins } from '@/lib/email/send';
import * as templates from '@/lib/email/templates';
import { sendEvent } from '@/lib/meta/capi';
import { META_CURRENCY, META_EVENTS, metaEventId } from '@/lib/meta/events';
import { listRegistrations, patchRegistration } from '@/lib/store';
import { maybeSettle } from '@/lib/settlement';
import { TRACKS } from '@/lib/training';

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

/**
 * The `custom_data` block Meta reads to value a conversion.
 *
 * `amount` is what we actually charge, which in test mode is a token shilling.
 * The Purchase event must carry the real price instead, or the return on ad
 * spend figure in Ads Manager is wrong by three orders of magnitude.
 */
function metaCustomData(registration) {
  const track = TRACKS[registration.track];

  return {
    currency: META_CURRENCY,
    value: track?.priceKes ?? registration.amount ?? 0,
    content_name: track?.name || 'Training',
    content_category: 'Training',
    content_type: 'product',
    content_ids: [registration.track],
    num_items: 1,
    order_id: registration.reference,
  };
}

/** Someone completed the form. Not paid yet. */
export async function onRegistrationCreated(registration) {
  const results = {};

  // Sent from the server, not the browser: this carries the registrant's email,
  // phone and name, hashed, which is what lets Meta match the person back to
  // the ad they clicked. A browser-only Lead has none of that.
  //
  // Started here and awaited at the bottom, so it overlaps the emails rather
  // than adding its own latency. The customer is watching a spinner waiting to
  // reach checkout, and Meta must never be the reason that takes longer.
  const metaLead = sendEvent({
    eventName: META_EVENTS.lead,
    eventId: metaEventId(META_EVENTS.lead, registration.reference),
    registration,
    customData: metaCustomData(registration),
  }).catch((err) => ({ sent: false, reason: err?.message }));

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

  results.metaLead = await metaLead;

  return results;
}

/**
 * Money is in. Confirm the seat, tell the admins, and start the sweep to the
 * bank account.
 */
export async function onPaymentConfirmed({ registration, payment }) {
  const results = {};

  // The one event the whole ad account is optimised against, and the only place
  // a shilling of revenue is ever reported to Meta. Started first and awaited
  // last so it overlaps the emails: Safaricom and Paystack both retry a webhook
  // that answers slowly, and a retry here would be a second confirmation email.
  const metaPurchase = sendEvent({
    eventName: META_EVENTS.purchase,
    eventId: metaEventId(META_EVENTS.purchase, registration.reference),
    registration,
    customData: metaCustomData(registration),
    eventTime: registration.paidAt,
  }).catch((err) => ({ sent: false, reason: err?.message }));

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

  results.metaPurchase = await metaPurchase;

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
